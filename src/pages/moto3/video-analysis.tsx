import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Video, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const metrics = [
  { name: 'Posture', score: 85, target: 90, color: 'text-blue-600', bg: 'bg-blue-500' },
  { name: 'Cornering', score: 78, target: 85, color: 'text-green-600', bg: 'bg-green-500' },
  { name: 'Braking', score: 92, target: 90, color: 'text-red-600', bg: 'bg-red-500' },
  { name: 'Acceleration', score: 88, target: 90, color: 'text-yellow-600', bg: 'bg-yellow-500' },
  { name: 'Body Position', score: 82, target: 88, color: 'text-purple-600', bg: 'bg-purple-500' },
];

export default function VideoAnalysis() {
  const navigate = useNavigate();
  const [hasVideo, setHasVideo] = useState(true);

  const overallScore = metrics.reduce((sum, m) => sum + m.score, 0) / metrics.length;
  const getGrade = (score: number) => {
    if (score >= 90) return { grade: 'A+', color: 'text-green-600' };
    if (score >= 85) return { grade: 'A', color: 'text-green-600' };
    if (score >= 80) return { grade: 'B+', color: 'text-blue-600' };
    if (score >= 75) return { grade: 'B', color: 'text-yellow-600' };
    return { grade: 'C', color: 'text-red-600' };
  };

  const grade = getGrade(overallScore);

  return (
    <div className="min-h-screen bg-background pb-6">
      <div className="bg-gradient-to-br from-orange-600 via-orange-500 to-red-500 text-white px-6 pt-8 pb-6">
        <div className="max-w-screen-xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Video className="w-8 h-8" />
            Video Analysis
          </h1>
          <p className="text-orange-100">AI-powered riding technique scoring</p>
        </div>
      </div>

      <div className="px-6 mt-6 max-w-screen-xl mx-auto space-y-6">
        {!hasVideo ? (
          <Card className="border-dashed border-2">
            <CardContent className="p-12 text-center">
              <Upload className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Upload Video</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Upload a video of your riding session for AI analysis
              </p>
              <Button onClick={() => setHasVideo(true)} className="bg-orange-600 hover:bg-orange-700">
                <Upload className="w-4 h-4 mr-2" />
                Choose Video
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Overall Score</CardTitle>
                <CardDescription>Last session analysis</CardDescription>
              </CardHeader>
              <CardContent className="text-center py-6">
                <div className={`text-7xl font-bold mb-2 ${grade.color}`}>
                  {grade.grade}
                </div>
                <div className="text-3xl font-bold text-muted-foreground mb-4">
                  {overallScore.toFixed(1)}/100
                </div>
                <Badge variant={overallScore >= 85 ? 'default' : 'secondary'}>
                  {overallScore >= 85 ? 'Excellent Performance' : 'Good, Room for Improvement'}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detailed Metrics</CardTitle>
                <CardDescription>AI analysis of riding technique</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {metrics.map((metric) => (
                  <div key={metric.name}>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">{metric.name}</span>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${metric.color}`}>
                          {metric.score}/100
                        </span>
                        <Badge variant="outline" className="text-xs">
                          Target: {metric.target}
                        </Badge>
                      </div>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${metric.bg} transition-all`}
                        style={{ width: `${metric.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>💡 Feedback & Suggestions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="p-3 bg-green-500/10 rounded-lg border border-green-500">
                  <strong className="text-green-700 dark:text-green-400">✅ Strengths:</strong>
                  <p className="text-muted-foreground mt-1">
                    Excellent braking technique! Late and hard braking shows confidence.
                  </p>
                </div>
                <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500">
                  <strong className="text-yellow-700 dark:text-yellow-400">⚠️ Areas to Improve:</strong>
                  <ul className="list-disc list-inside text-muted-foreground mt-1 space-y-1">
                    <li>Cornering: Shift weight more aggressively into turns</li>
                    <li>Body Position: Keep elbows higher and out</li>
                  </ul>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500">
                  <strong className="text-blue-700 dark:text-blue-400">📚 Recommended Exercises:</strong>
                  <ul className="list-disc list-inside text-muted-foreground mt-1 space-y-1">
                    <li>Side plank for lateral stability (3x45s)</li>
                    <li>Rotation exercises with resistance band</li>
                    <li>Practice body positioning off-bike</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={() => setHasVideo(false)}
              variant="outline"
              className="w-full"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload New Video
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
