'use client'
import axios from "axios";
import { Inter } from "next/font/google";
import Image from "next/image";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [buildStatus, setBuildStatus] = useState("");
  const [buildInfo, setBuildInfo] = useState(null);

  const handleBuild = async () => {
    const buildApi = "http://66.45.251.157:5001/job/template_2/build";
    const username = "demo_user";
    const token = "111449cadc923add4a7659f98dce1b7907";
    const credentials = btoa(`${username}:${token}`);

    try {
      const response = await axios.post(buildApi, {}, {
        headers: {
          "Authorization": `Basic ${credentials}`,
          "Content-Type": "application/json",
        },
      });

      const queueLocation = response.headers.location;
      console.log("queueLocation: ",queueLocation);
      const queueId = queueLocation.split('/').slice(-2, -1)[0]; 
      setBuildStatus("Processing.....");
      checkQueueStatus(queueId);
    } catch (error) { 
      setBuildStatus(`Processing failed: ${error.message}`);
    }
  };

  const checkQueueStatus = async (queueId) => {
    const queueApi = `http://66.45.251.157:5001/queue/item/${queueId}/api/json`;
    const username = "demo_user";
    const token = "111449cadc923add4a7659f98dce1b7907";
    const credentials = btoa(`${username}:${token}`);

    try {
      const response = await axios.get(queueApi, {
        headers: {
          "Authorization": `Basic ${credentials}`,
        },
      });

      if (response.data.executable) {
        const buildNumber = response.data.executable.number; 
        setBuildStatus(`Build is processing....`);
        checkBuildStatus(buildNumber);
      } else {
        setTimeout(() => checkQueueStatus(queueId), 2000);
      }
    } catch (error) {
      console.error("Error checking queue status:", error);
    }
  };

  const checkBuildStatus = async (buildNumber) => {
    const buildApi = `http://66.45.251.157:5001/job/template_2/${buildNumber}/api/json`;
    const username = "demo_user";
    const token = "111449cadc923add4a7659f98dce1b7907";
    const credentials = btoa(`${username}:${token}`);

    try {
      const response = await axios.get(buildApi, {
        headers: {
          "Authorization": `Basic ${credentials}`,
        },
      });

      const { result, building, estimatedDuration, timestamp } = response.data;
      console.log("checkBuildStatus response.data: ",response.data)         
        setBuildStatus(`Build ${result.toLowerCase()}`); 
        setTimeout(()=>{}, 4000);
    } catch (error) {
      console.error("Error checking build status:", error);
    }
  };

  return (
      <main
          className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
      > 
        <button className={"bg-amber-600 p-3 text-center"} type={'button'} onClick={handleBuild}>Build</button>
        <p>{buildStatus}</p>
        {buildInfo && <div>
          <p>Build Number: {buildInfo.number}</p>
          <p>Build URL: <a href={buildInfo.url} target="_blank">{buildInfo.url}</a></p>
        </div>} 



        <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
          <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
            Get started by editing&nbsp;
            <code className="font-mono font-bold">src/pages/index.js</code>
          </p>
          <div
              className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
            <a
                className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
                href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
                target="_blank"
                rel="noopener noreferrer"
            >
              By
              <Image
                  src="/vercel.svg"
                  alt="Vercel Logo"
                  className="dark:invert"
                  width={100}
                  height={24}
                  priority
              />
            </a>
          </div>
        </div>

        <div
            className="relative flex place-items-center before:absolute before:h-[300px] before:w-full sm:before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full sm:after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700/10 after:dark:from-sky-900 after:dark:via-[#0141ff]/40 before:lg:h-[360px]">
          <Image
              className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
              src="/next.svg"
              alt="Next.js Logo"
              width={180}
              height={37}
              priority
          />
        </div>

        <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
          <a
              href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
              className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
              target="_blank"
              rel="noopener noreferrer"
          >
            <h2 className={`mb-3 text-2xl font-semibold`}>
              Docs{" "}
              <span
                  className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
            </h2>
            <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
              Find in-depth information about Next.js features and API.
            </p>
          </a>

          <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
              className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
              target="_blank"
              rel="noopener noreferrer"
          >
            <h2 className={`mb-3 text-2xl font-semibold`}>
              Learn{" "}
              <span
                  className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
            </h2>
            <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
              Learn about Next.js in an interactive course with&nbsp;quizzes!
            </p>
          </a>






          <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
              className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
              target="_blank"
              rel="noopener noreferrer"
          >
            <h2 className={`mb-3 text-2xl font-semibold`}>
              Templates{" "}
              <span
                  className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
            </h2>
            <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
              Discover and deploy boilerplate example Next.js&nbsp;projects.
            </p>
          </a>

          <a
              href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
              className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
              target="_blank"
              rel="noopener noreferrer"
          >
            <h2 className={`mb-3 text-2xl font-semibold`}>
              Deploy{" "}
              <span
                  className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
            </h2>
            <p className={`m-0 max-w-[30ch] text-sm opacity-50 text-balance`}>
              Instantly deploy your Next.js site to a shareable URL with Vercel.
            </p>
          </a>
        </div>
      </main>
  );
}

