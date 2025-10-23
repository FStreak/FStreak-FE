"use client";
import React, {useState} from "react";
import Navbar from "@/components/navbar/Navbar";
function MockPost({author, text}: {author: string; text: string}){
  return (
    <div className="p-3 border rounded bg-card">
      <div className="text-sm font-medium">{author}</div>
      <div className="text-sm text-muted-foreground mt-1">{text}</div>
    </div>
  );
}

export default function DiscussionPage(){
  const [posts, setPosts] = useState([{author: 'Alice', text: 'When is assignment due?'}, {author:'Bob', text: 'I found the readings helpful.'}]);
  const [text, setText] = useState('');

  function add(){
    if(!text.trim()) return;
    setPosts(p=>[{author:'You', text:text.trim()}, ...p]);
    setText('');
  }

  return (
    <div className="space-y-4">
      <Navbar />
      <h2 className="text-lg font-semibold">Discussion Forums</h2>
      <div className="p-3 rounded border bg-card">
        <textarea value={text} onChange={(e)=>setText(e.target.value)} className="w-full p-2 rounded border bg-background text-foreground" rows={3} placeholder="Write a new post..."></textarea>
        <div className="mt-2 text-right">
          <button onClick={add} className="px-3 py-1 rounded bg-primary text-white text-sm">Post</button>
        </div>
      </div>

      <div className="space-y-3">
        {posts.map((p, i)=> <MockPost key={i} author={p.author} text={p.text}/>)}
      </div>
    </div>
  );
}
