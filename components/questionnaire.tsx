'use client';

import React, { useState } from 'react';
import { Question, QuestionOption } from '@/data/dummyQuestions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from 'framer-motion';

interface QuestionnaireProps {
  question: Question;
  onSubmit: (questionId: string, answer: string | number) => void;
  onSkip?: (questionId: string) => void; // Optional skip functionality
  title?: string; // Optional title for the card
}

export function Questionnaire({ question, onSubmit, onSkip, title }: QuestionnaireProps) {
  const [answer, setAnswer] = useState<string | number>('');
  const [isVisible, setIsVisible] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer === '' && question.type !== 'short-text' && question.type !== 'number') return; // Basic validation for choice
    setIsVisible(false); // Trigger fade-out animation
    // Delay submission until animation is partway through
    setTimeout(() => onSubmit(question.id, answer), 250);
  };

  const handleSkip = () => {
    setIsVisible(false); // Trigger fade-out animation
    // Delay skip until animation is partway through
    setTimeout(() => onSkip?.(question.id), 250);
  };

  const renderInput = () => {
    switch (question.type) {
      case 'multiple-choice':
        return (
          <RadioGroup value={answer as string} onValueChange={(value) => setAnswer(value)} className="space-y-2">
            {question.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                <Label htmlFor={`${question.id}-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      case 'short-text':
        return (
          <Input
            type="text"
            value={answer as string}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Your answer..."
          />
        );
      case 'number':
        return (
          <Input
            type="number"
            value={answer as number}
            onChange={(e) => setAnswer(e.target.valueAsNumber || '')} // Handle potential NaN
            placeholder="Enter a number..."
          />
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, height: 0, marginBottom: 0, transition: { duration: 0.3 } }}
           transition={{ duration: 0.3, ease: "easeInOut" }}
           className="overflow-hidden mb-6" // Added mb-6 for spacing when exiting
         >
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                {title && <CardTitle>{title}</CardTitle>}
                <CardDescription>{question.text}</CardDescription>
              </CardHeader>
              <CardContent>
                {renderInput()}
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                {onSkip && <Button type="button" variant="ghost" onClick={handleSkip}>Skip</Button>}
                <Button type="submit" disabled={answer === '' && question.type !== 'short-text' && question.type !== 'number'}>Submit</Button>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 