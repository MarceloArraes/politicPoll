import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ResultsProps {
  userAnswers: string[];
  questions: {
    id: number;
    text: string;
    options: string[];
  }[];
  results: {
    votes: number[];
  }[];
}

export default function Results({
  userAnswers,
  questions,
  results,
}: ResultsProps) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12">
      <Card className="w-[600px]">
        <CardHeader>
          <CardTitle>Resultados da Pesquisa</CardTitle>
          <CardDescription>
            Veja como suas respostas se comparam com as de outros participantes:
          </CardDescription>
        </CardHeader>
        <CardContent>
          {questions.map((question, index) => {
            const totalVotes = results[index].votes.reduce(
              (sum, votes) => sum + votes,
              0
            );
            return (
              <div key={question.id} className="mb-6">
                <p className="font-semibold">{question.text}</p>
                <p className="text-sm text-gray-600 mb-2">
                  Sua resposta: {userAnswers[index]}
                </p>
                {question.options.map((option, optionIndex) => {
                  const votes = results[index].votes[optionIndex];
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
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
