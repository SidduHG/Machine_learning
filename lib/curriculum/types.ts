export type Lesson = {
 id: string; module: string; title: string; summary: string; minutes: number;
 intuition: string[]; steps: string[]; formula: string; symbols: string;
 example: {title:string; body:string; steps:string[]}; pitfalls: string[];
 code: string; exercise: string; solution: string;
 quiz: {question:string; options:string[]; answer:number; explanation:string};
 sources: {title:string;url:string}[]; lab?: string;
};
export type Module = {id:string;title:string;description:string;level:string;color:string};
export const modules: Module[] = [
{id:'foundations',title:'The foundations',description:'Build fluency in Python, data, and the language of machine learning.',level:'Start here',color:'#356ed7'},
{id:'mathematics',title:'Math you can see',description:'Vectors, derivatives, probability, and statistics with concrete meaning.',level:'Foundations',color:'#288f8b'},
{id:'supervised',title:'Learning from examples',description:'Fit, optimize, classify, and understand why a model generalizes.',level:'Core ML',color:'#7060bc'},
{id:'models',title:'A toolkit of models',description:'Neighbors, Bayes, trees, ensembles, and large-margin classifiers.',level:'Core ML',color:'#bb6a3e'},
{id:'unsupervised',title:'Finding hidden structure',description:'Clustering, compression, anomalies, and honest evaluation.',level:'Intermediate',color:'#338b92'},
{id:'deep-learning',title:'Inside neural networks',description:'Tensors, backpropagation, optimization, images, and sequences.',level:'Intermediate',color:'#8262bf'},
{id:'modern-ai',title:'Modern AI systems',description:'Attention, transformers, embeddings, retrieval, and adaptation.',level:'Advanced',color:'#416ed6'},
{id:'engineering',title:'From notebook to production',description:'Build reproducible, observable, responsible systems and a portfolio.',level:'AI engineering',color:'#4e8070'},
];

