# Maintenance

## Upgrade Linkerd

Our installation scripts always install the latest version of Linkerd. This means our dev clusters are going to stay up-to-date anyway. But since production is a long-lived environment, we need to update Linkerd manually.

Follow the steps with Linkerd CLI in the official upgrade documentation: https://linkerd.io/2/tasks/upgrade/

## Upgrade Argo CD

We load the installation YAML file and commit it to our repository under [`infrastructure/kubernetes/argocd/install/install.yaml`](../infrastructure/kubernetes/argocd/install/install.yaml). To upgrade, update the file to the newest version:

```sh
curl -L https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml >infrastructure/kubernetes/argocd/install/install.yaml
yarn prettier --write infrastructure/kubernetes/argocd/install/install.yaml
```

Then follow the official upgrade documentation: https://argoproj.github.io/argo-cd/operator-manual/upgrading/overview/

**Please note:** We currently use the default Argo CD admin password, which is the argocd-server pod name and generated on first start. After upgrading Argo CD the pod name will change. If you want to change the password to change the new pod name, you can remove the `admin.password` and `admin.passwordMtime` keys in the `argocd-secret` and restart the server pod.