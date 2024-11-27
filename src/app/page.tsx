"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

const questions = [
  {
    id: 1,
    text: "O presidente atual é corrupto?",
    options: ["Sim", "Não", "Não tenho certeza"],
  },
  {
    id: 2,
    text: "A economia do país está melhorando?",
    options: ["Sim", "Não", "Está estável"],
  },
  {
    id: 3,
    text: "Você confia no sistema eleitoral?",
    options: ["Sim", "Não", "Parcialmente"],
  },
  {
    id: 4,
    text: "A educação pública precisa de mais investimentos?",
    options: ["Sim", "Não", "O investimento atual é suficiente"],
  },
];

// Simulated data for other people's votes
const simulatedResults = [
  { votes: [150, 80, 70] },
  { votes: [100, 120, 80] },
  { votes: [180, 60, 60] },
  { votes: [220, 30, 50] },
];

export default function PoliticalPoll() {
  const [answers, setAnswers] = useState<string[]>(
    new Array(questions.length).fill("")
  );

  const handleAnswer = (questionIndex: number, answer: string) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answer;
    setAnswers(newAnswers);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12">
      <Card className="w-[600px]">
        <CardHeader>
          <CardTitle>Pesquisa Política</CardTitle>
          <CardDescription>
            Responda as perguntas abaixo e veja os resultados imediatamente
          </CardDescription>
        </CardHeader>
        <CardContent>
          {questions.map((question, index) => (
            <div key={question.id} className="mb-8">
              <p className="text-lg font-semibold mb-2">{question.text}</p>
              <RadioGroup
                onValueChange={(value) => handleAnswer(index, value)}
                value={answers[index]}
              >
                {question.options.map((option, optionIndex) => (
                  <div
                    key={optionIndex}
                    className="flex items-center space-x-2 mb-2"
                  >
                    <RadioGroupItem
                      value={option}
                      id={`q${question.id}-option-${optionIndex}`}
                    />
                    <Label htmlFor={`q${question.id}-option-${optionIndex}`}>
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {answers[index] && (
                <div className="mt-4">
                  <p className="text-sm font-semibold mb-2">Resultados:</p>
                  {question.options.map((option, optionIndex) => {
                    const votes = simulatedResults[index].votes[optionIndex];
                    const totalVotes = simulatedResults[index].votes.reduce(
                      (sum, v) => sum + v,
                      0
                    );
                    const percentage = ((votes / totalVotes) * 100).toFixed(1);
                    return (
                      <div key={optionIndex} className="mb-2">
                        <div className="flex justify-between text-sm">
                          <span>{option}</span>
                          <span>
                            {votes} votos ({percentage}%)
                          </span>
                        </div>
                        <Progress
                          value={parseFloat(percentage)}
                          className="h-2"
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
