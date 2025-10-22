"use client";
import React from "react";
import {Star, CheckSquare, Clock, Globe} from "lucide-react";
import Navbar from "@/components/Navbar";
const rows = [
  {icon: <Star className="w-5 h-5 text-amber-500"/>, title: 'Basic Info', value: 'Course 1 of 5 in the Python for Everybody Specialization'},
  {icon: <CheckSquare className="w-5 h-5"/>, title: 'Level', value: 'Beginner'},
  {icon: <Clock className="w-5 h-5"/>, title: 'Commitment', value: '2-4 hours/week'},
  {icon: <Globe className="w-5 h-5"/>, title: 'Language', value: 'English'},
  {icon: <Star className="w-5 h-5 text-amber-500"/>, title: 'User Ratings', value: '★★★★☆ Average User Rating 4.8'},
];

export default function CourseInfoPage(){
  const instructor = {
    name: 'Dr. Charles Severance',
    institution: 'University of Michigan',
    subject: 'Programming and Python',
    rating: 4.8,
    intro: 'Dr. Chuck is a professor and popular course author who focuses on beginner-friendly programming education. His courses emphasize hands-on practice and real-world examples.'
  };

  function renderStars(rating: number){
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    const out = [] as string[];
    for(let i=0;i<full;i++) out.push('★');
    if(half) out.push('☆');
    while(out.length < 5) out.push('☆');
    return out.join(' ');
  }

  return (
    <div className="space-y-4">
      <Navbar />
      <h2 className="text-lg font-semibold">Course Info</h2>

      <div className="rounded border overflow-hidden bg-card">
        <div className="p-4 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center text-xl font-bold text-muted-foreground">CS</div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{instructor.name}</div>
                  <div className="text-xs text-muted-foreground">{instructor.institution} • {instructor.subject}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{instructor.rating.toFixed(1)}</div>
                  <div className="text-xs text-amber-500">{renderStars(instructor.rating)}</div>
                </div>
              </div>

              <p className="mt-3 text-sm text-muted-foreground">{instructor.intro}</p>
            </div>
          </div>

          <div>
            <div className="space-y-2">
              {rows.map((r, i)=> (
                <div key={i} className={`flex items-start gap-4 py-3 ${i % 2 === 0 ? '' : 'bg-muted/5'}`}>
                  <div className="flex-none">{r.icon}</div>
                  <div className="flex-1 text-sm">
                    <div className="font-medium">{r.title}</div>
                    <div className="text-muted-foreground">{r.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
