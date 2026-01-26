'use client'

function DownloadIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 10.8333V17.5L6.66669 14.1667" stroke="#013CC6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M10 17.5L13.3333 14.1667" stroke="#013CC6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M3.66084 12.7242C2.98022 12.1288 2.44736 11.3833 2.10431 10.5466C1.76126 9.70991 1.61744 8.80492 1.68419 7.9031C1.75094 7.00128 2.02644 6.12733 2.48893 5.35027C2.95142 4.5732 3.58824 3.9143 4.3491 3.42559C5.10995 2.93689 5.97401 2.63177 6.87303 2.53433C7.77205 2.43688 8.68141 2.54979 9.5293 2.86412C10.3772 3.17845 11.1404 3.68561 11.7586 4.34554C12.3769 5.00547 12.8332 5.80009 13.0917 6.66667H14.5833C15.3934 6.66656 16.1817 6.92877 16.8303 7.41405C17.4789 7.89932 17.953 8.58158 18.1815 9.35873C18.41 10.1359 18.3807 10.9661 18.0981 11.7253C17.8154 12.4844 17.2945 13.1316 16.6133 13.57" stroke="#013CC6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  )
}
export default function Downloads() {
  const base = 'https://s3.dev.maayanlab.cloud/gsfm'

  return (
    <>

      <div
        className="relative h-[450px] overflow-hidden border-b border-gray-200"
      >
        <div
          style={{
            position: 'absolute',
            right: '0px',
            top: '-410px',
            height: '630px',
            width: '630px',
            backgroundImage: 'url("/resources/DownloadHeroRight.svg")',
          }}
        />
        <div
          className="hidden lg:block"
          style={{
            position: 'absolute',
            bottom: '-510px',
            height: '630px',
            width: '630px',
            backgroundImage: 'url("/resources/DownloadHeroLeft.svg")',
          }}
        />
        <div className="flex h-full w-full justify-center items-center prose prose-h1:text-primary prose-h1:font-normal prose-h1:text-6xl text-center max-w-none">
          <h1>Downloads</h1>
        </div>
      </div>
      <main className="bg-white py-4 p-8 gap-8">
        <div className="mx-16 flex flex-col">
          <table>
            <thead>
              <tr>
                <th className="text-primary border-b border-l border-primary text-left p-2">File</th>
                <th className="text-primary border-b border-l border-primary text-left p-2">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-4">
                  <a className="btn btn-secondary" href={`${base}/predictions.zip`}>
                    predictions.zip
                    &nbsp;
                    <DownloadIcon />
                  </a>
                </td>
                <td className="py-4 text-primary">All CF Predictions</td>
              </tr>
              <tr>
                <td className="py-4">
                  <a className="btn btn-secondary" href={`${base}/deepdive_gemini_markdown_descriptions.pkl`}>
                    deepdive_gemini_markdown_descriptions.pkl
                    &nbsp;
                    <DownloadIcon />
                  </a>
                </td>
                <td className="py-4 text-primary">Gemini Deepdive Gene Summaries</td>
              </tr>
              <tr>
                <td className="py-4">
                  <a className="btn btn-secondary" href={`${base}/deepdive_gpt4o_markdown_descriptions.pkl`}>
                    deepdive_gpt4o_markdown_descriptions.pkl
                    &nbsp;
                    <DownloadIcon />
                  </a>
                </td>
                <td className="py-4 text-primary">GPT4o Deepdive Gene Summaries</td>
              </tr>
            </tbody>
          </table>
          <div className="prose text-primary">
            <p>
              For model weights, see our <a className="text-[#006DFF]" href={`https://huggingface.co/collections/maayanlab/gsfm-68d5a2ff093d93d3c005108e`}>GSFM collection</a> on HuggingFace.
            </p>
          </div>
        </div>
      </main>
    </>
  )
}
