// import { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Copy, X, Loader2, Code, Brain, CheckCircle2 } from 'lucide-react';

// interface Problem {
//     title: string;
//     description: string;
//     example: string;
//     expectedOutput: string;
//     explanation: string;
// }

// type Difficulty = 'beginner' | 'intermediate' | 'advanced';
// type ProblemType = 'array' | 'string';

// export const ProblemGenerator = () => {
//     const [isOpen, setIsOpen] = useState(false);
//     const [selectedDifficulty, setSelectedDifficulty] = useState<any>('beginner');
//     const [selectedType, setSelectedType] = useState<any>('array');
//     const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState('');
//     const [copySuccess, setCopySuccess] = useState(false);

//     // Function to generate a problem using Cloudflare AI
//     const generateProblem = async () => {
//         setIsLoading(true);
//         setError('');
//         setCopySuccess(false);
        
//         try {
//             // Call to your Next.js API route
//             const response = await fetch('/api/generate-problem', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     difficulty: selectedDifficulty,
//                     type: selectedType
//                 }),
//             });
            
//             if (!response.ok) {
//                 throw new Error('Failed to generate problem');
//             }
            
//             const data = await response.json();
            
//             if (data.error) {
//                 throw new Error(data.error);
//             }
            
//             setCurrentProblem(data.problem);
//         } catch (err) {
//             console.error('Error generating problem:', err);
//             setError('Failed to generate problem. Please try again.');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const copyProblem = () => {
//         if (currentProblem) {
//             const textToCopy = `Problem: ${currentProblem.title}
// Description: ${currentProblem.description}
// Example: ${currentProblem.example}
// Expected Output: ${currentProblem.expectedOutput}
// Explanation: ${currentProblem.explanation}`;
            
//             navigator.clipboard.writeText(textToCopy);
//             setCopySuccess(true);
            
//             // Reset copy success after 2 seconds
//             setTimeout(() => setCopySuccess(false), 2000);
//         }
//     };

//     return (
//         <>
//             <motion.button
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 onClick={() => setIsOpen(true)}
//                 className="flex items-center space-x-2 rounded-lg border-2 border-purple-500 bg-purple-500/10 px-4 py-2 text-sm font-medium text-purple-500 hover:bg-purple-500/20"
//             >
//                 <Brain className="h-5 w-5" />
//                 <span>AI Problem Generator</span>
//             </motion.button>

//             <AnimatePresence>
//                 {isOpen && (
//                     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
//                         <motion.div
//                             initial={{ opacity: 0, scale: 0.95 }}
//                             animate={{ opacity: 1, scale: 1 }}
//                             exit={{ opacity: 0, scale: 0.95 }}
//                             className="relative w-full max-w-2xl rounded-lg bg-background p-6 shadow-lg"
//                         >
//                             <button
//                                 onClick={() => setIsOpen(false)}
//                                 className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
//                             >
//                                 <X className="h-4 w-4" />
//                             </button>

//                             <h2 className="mb-2 flex items-center gap-2 text-xl font-bold">
//                                 <Brain className="h-6 w-6 text-purple-500" />
//                                 AI Problem Generator
//                             </h2>
//                             <p className="text-sm text-muted-foreground">
//                                 Select options and generate coding problems with AI
//                             </p>
                            
//                             <div className="mt-6 space-y-4">
//                                 <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//                                     <div className="space-y-2">
//                                         <label className="text-sm font-medium">Difficulty Level</label>
//                                         <select
//                                             value={selectedDifficulty}
//                                             onChange={(e) => setSelectedDifficulty(e.target.value)}
//                                             className="w-full rounded-md border bg-background px-3 py-2 text-sm"
//                                         >
//                                             <option value="beginner">Beginner</option>
//                                             <option value="intermediate">Intermediate</option>
//                                             <option value="advanced">Advanced</option>
//                                         </select>
//                                     </div>
//                                     <div className="space-y-2">
//                                         <label className="text-sm font-medium">Problem Type</label>
//                                         <select
//                                             value={selectedType}
//                                             onChange={(e) => setSelectedType(e.target.value)}
//                                             className="w-full rounded-md border bg-background px-3 py-2 text-sm"
//                                         >
//                                             <option value="array">Array</option>
//                                             <option value="string">String</option>
//                                         </select>
//                                     </div>
//                                 </div>

//                                 <button
//                                     onClick={generateProblem}
//                                     disabled={isLoading}
//                                     className="w-full rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-70"
//                                 >
//                                     {isLoading ? (
//                                         <span className="flex items-center justify-center gap-2">
//                                             <Loader2 className="h-4 w-4 animate-spin" />
//                                             Generating with AI...
//                                         </span>
//                                     ) : (
//                                         <span className="flex items-center justify-center gap-2">
//                                             <Code className="h-4 w-4" />
//                                             Generate Problem
//                                         </span>
//                                     )}
//                                 </button>

//                                 {error && (
//                                     <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
//                                         {error}
//                                     </div>
//                                 )}

//                                 {currentProblem && (
//                                     <motion.div 
//                                         initial={{ opacity: 0, y: 10 }}
//                                         animate={{ opacity: 1, y: 0 }}
//                                         className="max-h-96 space-y-4 overflow-y-auto rounded-lg border p-4"
//                                     >
//                                         <div className="flex items-center justify-between">
//                                             <h3 className="text-lg font-semibold">{currentProblem.title}</h3>
//                                             <button
//                                                 onClick={copyProblem}
//                                                 className="flex items-center space-x-2 rounded-md px-2 py-1 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
//                                             >
//                                                 {copySuccess ? (
//                                                     <>
//                                                         <CheckCircle2 className="h-4 w-4 text-green-500" />
//                                                         <span className="text-green-500">Copied!</span>
//                                                     </>
//                                                 ) : (
//                                                     <>
//                                                         <Copy className="h-4 w-4" />
//                                                         <span>Copy</span>
//                                                     </>
//                                                 )}
//                                             </button>
//                                         </div>
//                                         <p className="text-sm text-muted-foreground">{currentProblem.description}</p>
                                        
//                                         <div className="rounded-md bg-purple-50 p-3 text-sm text-purple-800">
//                                             <h4 className="font-medium">Explanation:</h4>
//                                             <p>{currentProblem.explanation}</p>
//                                         </div>
                                        
//                                         <div className="space-y-2">
//                                             <h4 className="font-medium">Example:</h4>
//                                             <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
//                                                 <code>{currentProblem.example}</code>
//                                             </pre>
//                                         </div>
//                                         <div className="space-y-2">
//                                             <h4 className="font-medium">Expected Output:</h4>
//                                             <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
//                                                 <code>{currentProblem.expectedOutput}</code>
//                                             </pre>
//                                         </div>
//                                     </motion.div>
//                                 )}
//                             </div>
//                         </motion.div>
//                     </div>
//                 )}
//             </AnimatePresence>
//         </>
//     );
// };



import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, X, Loader2, Code, Brain, CheckCircle2, FileCode } from 'lucide-react';
import { useEditorStore } from '@/lib/store';

interface Problem {
    title: string;
    description: string;
    example: string;
    expectedOutput: string;
    explanation: string;
}

type Difficulty = 'beginner' | 'intermediate' | 'advanced';
type ProblemType = 'array' | 'string';

export const ProblemGenerator = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDifficulty, setSelectedDifficulty] = useState<any>('beginner');
    const [selectedType, setSelectedType] = useState<any>('array');
    const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [copySuccess, setCopySuccess] = useState(false);
    const [insertSuccess, setInsertSuccess] = useState(false);
    const { setCode } = useEditorStore();

    // Function to generate a problem using Cloudflare AI
    const generateProblem = async () => {
        setIsLoading(true);
        setError('');
        setCopySuccess(false);
        setInsertSuccess(false);
        
        try {
            // Call to your Next.js API route
            const response = await fetch('/api/generate-problem', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    difficulty: selectedDifficulty,
                    type: selectedType
                }),
            });
            
            if (!response.ok) {
                throw new Error('Failed to generate problem');
            }
            
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }
            
            setCurrentProblem(data.problem);
        } catch (err) {
            console.error('Error generating problem:', err);
            setError('Failed to generate problem. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const copyProblem = () => {
        if (currentProblem) {
            const textToCopy = `Problem: ${currentProblem.title}
Description: ${currentProblem.description}
Example: ${currentProblem.example}
Expected Output: ${currentProblem.expectedOutput}
Explanation: ${currentProblem.explanation}`;
            
            navigator.clipboard.writeText(textToCopy);
            setCopySuccess(true);
            
            // Reset copy success after 2 seconds
            setTimeout(() => setCopySuccess(false), 2000);
        }
    };

    const insertToEditor = () => {
        if (currentProblem) {
            // Create a function template based on the problem
            const functionName = currentProblem.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '_')
                .replace(/^_+|_+$/g, '');
                
            // Determine if we're working with arrays or strings to create appropriate parameter
            const paramType = selectedType === 'array' ? 'arr' : 'str';
            
            const codeTemplate = `/**
 * ${currentProblem.title}
 * 
 * ${currentProblem.description}
 */
function ${functionName}(${paramType}) {
  // Your solution here
  
  return;
}

// Example:
// Input: ${currentProblem.example}
// Expected Output: ${currentProblem.expectedOutput}
// ${currentProblem.explanation}

// Test your solution
console.log(${functionName}(${currentProblem.example}));
`;
            
            // Set the code in the editor
            setCode(codeTemplate);
            setInsertSuccess(true);
            
            // Reset insert success after 2 seconds
            setTimeout(() => setInsertSuccess(false), 2000);
            
            // Close the modal
            setIsOpen(false);
        }
    };

    return (
        <>
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsOpen(true)}
                className="flex items-center space-x-1 rounded-md border border-purple-500 bg-purple-500/10 px-2 py-1 text-xs font-medium text-purple-500 hover:bg-purple-500/20"
            >
                <Brain className="h-3.5 w-3.5" />
                <span>Problems</span>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-2xl rounded-lg bg-background p-6 shadow-lg"
                        >
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-4 w-4" />
                            </button>

                            <h2 className="mb-2 flex items-center gap-2 text-xl font-bold">
                                <Brain className="h-6 w-6 text-purple-500" />
                                AI Problem Generator
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Select options and generate coding problems with AI
                            </p>
                            
                            <div className="mt-6 space-y-4">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Difficulty Level</label>
                                        <select
                                            value={selectedDifficulty}
                                            onChange={(e) => setSelectedDifficulty(e.target.value)}
                                            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                                        >
                                            <option value="beginner">Beginner</option>
                                            <option value="intermediate">Intermediate</option>
                                            <option value="advanced">Advanced</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Problem Type</label>
                                        <select
                                            value={selectedType}
                                            onChange={(e) => setSelectedType(e.target.value)}
                                            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                                        >
                                            <option value="array">Array</option>
                                            <option value="string">String</option>
                                        </select>
                                    </div>
                                </div>

                                <button
                                    onClick={generateProblem}
                                    disabled={isLoading}
                                    className="w-full rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-70"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Generating with AI...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            <Code className="h-4 w-4" />
                                            Generate Problem
                                        </span>
                                    )}
                                </button>

                                {error && (
                                    <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
                                        {error}
                                    </div>
                                )}

                                {currentProblem && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="max-h-96 space-y-4 overflow-y-auto rounded-lg border p-4"
                                    >
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-semibold">{currentProblem.title}</h3>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={insertToEditor}
                                                    className="flex items-center space-x-2 rounded-md px-2 py-1 text-sm text-blue-600 hover:bg-blue-50"
                                                >
                                                    {insertSuccess ? (
                                                        <>
                                                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                            <span className="text-green-500">Inserted!</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FileCode className="h-4 w-4" />
                                                            <span>Insert to Editor</span>
                                                        </>
                                                    )}
                                                </button>
                                                <button
                                                    onClick={copyProblem}
                                                    className="flex items-center space-x-2 rounded-md px-2 py-1 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                                                >
                                                    {copySuccess ? (
                                                        <>
                                                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                            <span className="text-green-500">Copied!</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy className="h-4 w-4" />
                                                            <span>Copy</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{currentProblem.description}</p>
                                        
                                        <div className="rounded-md bg-purple-50 p-3 text-sm text-purple-800">
                                            <h4 className="font-medium">Explanation:</h4>
                                            <p>{currentProblem.explanation}</p>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <h4 className="font-medium">Example:</h4>
                                            <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                                                <code>{currentProblem.example}</code>
                                            </pre>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="font-medium">Expected Output:</h4>
                                            <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                                                <code>{currentProblem.expectedOutput}</code>
                                            </pre>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};