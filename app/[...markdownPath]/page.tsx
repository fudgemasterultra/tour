import { contentManager } from "@/lib/contentManager";
import styles from "./page.module.css";
import React from "react";
import { parseMdxFile } from "@/lib/server-functions";
import ContentViewer from "../components/ContentViewer";
import EditorNOutput from "../components/EditorNOutput";

export function generateMetadata({
  params,
}: {
  params: { markdownPath: string[] };
}) {
  const urlPath = params.markdownPath.join("/");
  const { mdPath, chapterTitle } = contentManager.getPageMeta(urlPath);
  const { metadata } = parseMdxFile(mdPath);

  return {
    title: `${metadata.title}: ${chapterTitle} | A Tour of JSON Schema`,
    description: metadata.description,
    keywords: metadata.keywords,
  };
}

export default async function Content({
  params,
}: {
  params: { markdownPath: string[] };
}) {
  const urlPath = params.markdownPath.join("/");

  const { mdPath, nextStepPath, stepIndex, totalSteps, codeFile } =
    contentManager.getPageMeta(urlPath);
  const { Page, metadata } = parseMdxFile(mdPath);

  return (
    <div className={styles.mainArea}>
      <ContentViewer stepIndex={stepIndex} totalSteps={totalSteps}>
        <Page />
      </ContentViewer>
      <EditorNOutput codeFile={codeFile} nextStepPath={nextStepPath} />
    </div>
  );
}
export async function generateStaticParams() {
  const outline = contentManager.getOutline();
  const pathList: { markdownPath: string[] }[] = [];

  outline.map((item) => {
    item.steps.map((step) => {
      pathList.push({
        markdownPath: [item.folderName, step.fileName],
      });
    });
  });

  return pathList;
}
