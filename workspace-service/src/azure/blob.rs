use anyhow::{anyhow, Result};
use async_compat::Compat;
use azure_sdk_core::prelude::*;
use azure_sdk_storage_blob::{blob::CopyStatus, Blob};
use azure_sdk_storage_core::prelude::*;
use std::convert::{TryFrom, TryInto};
use url::Url;

#[derive(PartialEq, Debug)]
struct FileParts {
    account: String,
    container: String,
    blob: Option<String>,
}

impl TryFrom<Url> for FileParts {
    type Error = anyhow::Error;

    fn try_from(value: Url) -> Result<Self, Self::Error> {
        let account = value
            .host()
            .ok_or_else(|| anyhow!("cannot get host from url"))?
            .to_string();
        let account = account
            .split('.')
            .next()
            .ok_or_else(|| anyhow!("cannot get storage account from url"))?
            .to_string();

        let path_segments = value
            .path_segments()
            .ok_or_else(|| anyhow!("url has no path"))?
            .collect::<Vec<&str>>();

        let container = path_segments
            .get(0)
            .ok_or_else(|| anyhow!("cannot get container name from url"))?
            .to_string();

        let blob = path_segments.get(1).cloned().map(|s| s.to_string());

        Ok(Self {
            account,
            container,
            blob,
        })
    }
}

pub async fn copy_blob_from_url(url: &Url, azure_config: &super::Config) -> Result<String> {
    let input: FileParts = url.clone().try_into()?;
    let target: FileParts = azure_config.files_container_url.clone().try_into()?;
    let source: FileParts = azure_config.upload_container_url.clone().try_into()?;

    if input.account != source.account {
        return Err(anyhow!(
            "source file is from an unsupported storage account"
        ));
    }

    if input.container != source.container {
        return Err(anyhow!("source file is from an unsupported container"));
    }

    let mut source_url = url.clone();
    source_url.set_query(None);
    let source_url = super::create_download_sas(azure_config, &source_url)?;

    let target_blob = input
        .blob
        .ok_or_else(|| anyhow!("cannot get blob name from url"))?;

    let client = client::with_access_key(&target.account, &azure_config.access_key);
    let response = Compat::new(
        client
            .copy_blob_from_url()
            .with_container_name(&target.container)
            .with_blob_name(&target_blob)
            .with_source_url(source_url.as_str())
            .with_is_synchronous(true)
            .finalize(),
    )
    .await?;

    match response.copy_status {
        CopyStatus::Success => Ok(format!(
            "{}/{}",
            azure_config.files_container_url, target_blob
        )),
        _ => Err(anyhow!(
            "Sync copy did not complete: {}",
            response.copy_status
        )),
    }
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn extract_from_url() {
        let url =
            Url::parse("https://fnhsfilesdevstu.blob.core.windows.net/upload/my_blob").unwrap();
        let actual: FileParts = url.try_into().unwrap();
        let expected = FileParts {
            account: "fnhsfilesdevstu".to_string(),
            container: "upload".to_string(),
            blob: Some("my_blob".to_string()),
        };
        assert_eq!(actual, expected);
    }

    #[test]
    fn extract_from_url_without_blob() {
        let url = Url::parse("https://fnhsfilesdevstu.blob.core.windows.net/upload").unwrap();
        let actual: FileParts = url.try_into().unwrap();
        let expected = FileParts {
            account: "fnhsfilesdevstu".to_string(),
            container: "upload".to_string(),
            blob: None,
        };
        assert_eq!(actual, expected);
    }
}
