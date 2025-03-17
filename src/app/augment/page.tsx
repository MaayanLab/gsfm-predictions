'use client'

import React from "react"

const example = {
  gene_set: `TYROBP\nLILRB1\nSLC11A1\nTNFSF18\nFCER1G\nEIF2AK4\nMDK\nSEMA6D\nIFNA6\nIFNK\nIFNB1\nIFNA2\nIFNA14\nIFNA7\nIFNA1\nIFNE\nIFNA4\nIFNA5\nPLXNA1\nITGAL\nICAM1\nF2RL1\nTOX4\nCD74\nIFNA21\nIFNA8\nIFNW1\nIFNA16\nIFNA10\nIFNA17`,
  description: 'T Cell Activation Involved in Immune Response (GO:0002286)',
}

export default function AugmentPage() {
  const [geneSet, setGeneSet] = React.useState('')
  const [description, setDescription] = React.useState('')
  return (
    <>
      <div className="prose text-justify">
        <p>Trained on millions of gene sets automatically extracted from literature and raw RNA-seq data, GSFM learns to recover held-out genes from gene sets. The resulting model exhibits state of the art performance on gene function prediction.</p>
        <p>Submit your set of known genes and get predictions for missing genes in the set.</p>
      </div>
      <fieldset className="fieldset w-80">
        <legend className="fieldset-legend text-lg">Augment Gene Set</legend>
        <textarea
          className="input h-48 whitespace-pre"
          value={geneSet}
          onChange={evt => {setGeneSet(evt.currentTarget.value)}}
          placeholder={`Gene\nSymbols\nLine\nBy\nLine\n...`}
        />
        <input
          className="input"
          value={description}
          onChange={evt => {setDescription(evt.currentTarget.value)}}
          placeholder="Gene set description"
        />
        <button className="btn" onClick={evt => {setGeneSet(example.gene_set); setDescription(example.description)}}>Example</button>
        <button className="btn btn-primary" disabled>Submit</button>
      </fieldset>
    </>
  )
}