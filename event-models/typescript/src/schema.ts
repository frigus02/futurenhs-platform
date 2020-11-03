/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Event = BaseEvent &
  (
    | ContentViewed
    | FileCreated
    | FileUpdated
    | FileDeleted
    | FolderCreated
    | WorkspaceCreated
  );

export interface BaseEvent {
  id: string;
  subject: string;
  eventTime: string;
  [k: string]: unknown;
}
export interface ContentViewed {
  eventType: "ContentViewed";
  dataVersion: "1";
  data: {
    userId: string;
    contentId: string;
    contentType: "Folder" | "File";
    workspaceId: string;
    error?: string;
    [k: string]: unknown;
  };
  [k: string]: unknown;
}
export interface FileCreated {
  eventType: "FileCreated";
  dataVersion: "1";
  data: {
    fileId: string;
    /**
     * The date at which the file has been created
     */
    createdAt: string;
    /**
     * The folder that the file is in
     */
    folderId: string;
    /**
     * The workspace that the file is in
     */
    workspaceId: string;
    fileTitle: string;
    fileDescription: string;
    /**
     * The MIME type of the file, e.g. text/csv for a CSV file
     */
    fileType: string;
    versionId: string;
    versionNumber: number;
    /**
     * The user that created the file
     */
    userId: string;
    [k: string]: unknown;
  };
  [k: string]: unknown;
}
export interface FileUpdated {
  eventType: "FileUpdated";
  dataVersion: "1";
  data: {
    fileId: string;
    /**
     * The date at which the file has been updated (= the new file version has been created)
     */
    updatedAt: string;
    /**
     * The folder that the file is in
     */
    folderId: string;
    /**
     * The workspace that the file is in
     */
    workspaceId: string;
    fileTitle: string;
    fileDescription: string;
    /**
     * The MIME type of the file, e.g. text/csv for a CSV file
     */
    fileType: string;
    versionId: string;
    versionNumber: number;
    /**
     * The user that created the file
     */
    userId: string;
    [k: string]: unknown;
  };
  [k: string]: unknown;
}
export interface FileDeleted {
  eventType: "FileDeleted";
  dataVersion: "1";
  data: {
    fileId: string;
    /**
     * The user that deleted the file
     */
    userId: string;
    versionId: string;
    versionNumber: number;
    /**
     * The workspace that the file is in
     */
    workspaceId: string;
    [k: string]: unknown;
  };
  [k: string]: unknown;
}
export interface FolderCreated {
  eventType: "FolderCreated";
  dataVersion: "1";
  data: {
    folderId: string;
    /**
     * The workspace that the folder is in
     */
    workspaceId: string;
    title: string;
    description: string;
    /**
     * The user that created the folder
     */
    userId: string;
    [k: string]: unknown;
  };
  [k: string]: unknown;
}
export interface WorkspaceCreated {
  eventType: "WorkspaceCreated";
  dataVersion: "1";
  data: {
    workspaceId: string;
    title: string;
    /**
     * The id of the user that created the workspace
     */
    userId: string;
    [k: string]: unknown;
  };
  [k: string]: unknown;
}
