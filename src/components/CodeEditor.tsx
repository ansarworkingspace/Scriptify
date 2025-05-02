import { FC } from 'react';
import Editor from '@monaco-editor/react';
import { useEditorStore } from '@/lib/store';
import { RefreshCw } from 'lucide-react';

export const CodeEditor: FC = () => {
    const { code, setCode, clearCode } = useEditorStore();

    return (
        <div className="relative h-full w-full rounded-lg overflow-hidden border border-border bg-[#1E1E1E] pt-4">
            <div className="absolute right-4 top-2 z-10">
                <button 
                    onClick={clearCode}
                    className="text-gray-400 hover:text-white transition-colors"
                    title="Clear Editor"
                >
                    <RefreshCw className="h-4 w-4" />
                </button>
            </div>
            
            <Editor
                height="100%"
                defaultLanguage="javascript"
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value || '')}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    roundedSelection: true,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                }}
            />
        </div>
    );
};