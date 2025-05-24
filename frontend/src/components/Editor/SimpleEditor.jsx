// components/SimpleEditor.js
'use client';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import AuraButton from '../AuraButton';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

export default function SimpleEditor({ onSubmit,code,setCode }) {
  

  return (
    <div>
      <MonacoEditor
        height="400px"
        theme="vs-dark"
        language="python"
        value={code}
        onChange={(val) => setCode(val)}
      />
      <AuraButton auraColor={"white"} borderStyle="2px solid lime" style={{backgroundColor:"blue"}} onClick={onSubmit(code)}>
        Submit & Save
      </AuraButton>
    </div>
  );
}
