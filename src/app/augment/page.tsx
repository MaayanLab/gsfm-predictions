export default function Page () {
  return (
    <main className="container mx-auto flex flex-col place-items-center items-center grow gap-4 my-4">
      <div className="prose text-justify">
        <p>Trained on millions of gene sets automatically extracted from literature and raw RNA-seq data, GSFM learns to recover held-out genes from gene sets. The resulting model exhibits state of the art performance on gene function prediction.</p>
        <p>Submit your set of known genes and get predictions for missing genes in the set.</p>
      </div>
      <fieldset className="fieldset">
        <legend className="fieldset-legend text-lg">Augment Gene Set</legend>
        <textarea className="input h-32" />
        <button className="btn">Example</button>
        <button className="btn btn-primary">Submit</button>
      </fieldset>
    </main>
  )
}