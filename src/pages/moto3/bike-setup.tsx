import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Bike, Settings, Wrench } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BikeSetup() {
  const navigate = useNavigate();

  const setupCategories = [
    {
      name: 'Suspension',
      icon: '⚙️',
      settings: [
        { param: 'Fork Compression', baseline: '12 clicks', recommendation: '10-14 based on track' },
        { param: 'Fork Rebound', baseline: '14 clicks', recommendation: '12-16 clicks' },
        { param: 'Shock Compression', baseline: '10 clicks', recommendation: '8-12 clicks' },
        { param: 'Shock Rebound', baseline: '12 clicks', recommendation: '10-14 clicks' },
        { param: 'Sag Front', baseline: '30-32mm', recommendation: 'Check pre-session' },
        { param: 'Sag Rear', baseline: '25-27mm', recommendation: 'Rider weight dependent' },
      ],
    },
    {
      name: 'Ergonomics',
      icon: '🏍️',
      settings: [
        { param: 'Handlebar Height', baseline: 'Standard', recommendation: '+5mm for aggressive riding' },
        { param: 'Lever Position', baseline: '2 fingers', recommendation: 'Adjust for comfort' },
        { param: 'Footpeg Position', baseline: 'Stock', recommendation: 'Lower for stability' },
        { param: 'Seat Height', baseline: '785mm', recommendation: 'Check reach to ground' },
      ],
    },
    {
      name: 'Tires',
      icon: '🛞',
      settings: [
        { param: 'Front Pressure (Cold)', baseline: '1.9 bar', recommendation: '1.8-2.0 bar' },
        { param: 'Rear Pressure (Cold)', baseline: '1.7 bar', recommendation: '1.6-1.8 bar' },
        { param: 'Front Compound', baseline: 'Medium', recommendation: 'Soft for qualifying' },
        { param: 'Rear Compound', baseline: 'Medium', recommendation: 'Hard for race distance' },
      ],
    },
    {
      name: 'Electronics',
      icon: '⚡',
      settings: [
        { param: 'Traction Control', baseline: 'Level 3', recommendation: '2-4 (wet: 5-6)' },
        { param: 'Engine Brake', baseline: 'Level 2', recommendation: '1-3 based on preference' },
        { param: 'Power Mode', baseline: 'Full', recommendation: 'Rain mode for wet' },
        { param: 'Quick Shifter', baseline: 'Active', recommendation: 'Always on' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-6">
      <div className="bg-gradient-to-br from-cyan-600 via-blue-500 to-indigo-500 text-white px-6 pt-8 pb-6">
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
            <Bike className="w-8 h-8" />
            Bike Setup Guide
          </h1>
          <p className="text-cyan-100">Configuration & settings reference</p>
        </div>
      </div>

      <div className="px-6 mt-6 max-w-screen-xl mx-auto space-y-6">
        <Card>
          <CardContent className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
            <div className="flex items-start gap-3">
              <Settings className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <strong>Setup Philosophy:</strong> Start with baseline settings and make
                incremental changes. Document everything and test one change at a time.
                <br />
                <strong className="text-red-600">⚠️ Safety First:</strong> Always have a
                qualified mechanic verify critical settings.
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="suspension" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="suspension">
              <Wrench className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Suspension</span>
            </TabsTrigger>
            <TabsTrigger value="ergonomics">
              <span className="text-lg mr-1">🏍️</span>
              <span className="hidden sm:inline">Ergo</span>
            </TabsTrigger>
            <TabsTrigger value="tires">
              <span className="text-lg mr-1">🛞</span>
              <span className="hidden sm:inline">Tires</span>
            </TabsTrigger>
            <TabsTrigger value="electronics">
              <span className="text-lg mr-1">⚡</span>
              <span className="hidden sm:inline">Electronics</span>
            </TabsTrigger>
          </TabsList>

          {setupCategories.map((category) => (
            <TabsContent key={category.name.toLowerCase()} value={category.name.toLowerCase()}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">{category.icon}</span>
                    {category.name}
                  </CardTitle>
                  <CardDescription>Recommended settings and adjustments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {category.settings.map((setting, idx) => (
                      <div key={idx} className="p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold">{setting.param}</h4>
                          <Badge variant="outline">{setting.baseline}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          💡 {setting.recommendation}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>📋 Pre-Session Checklist</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {[
                'Check tire pressures (cold)',
                'Verify suspension sag settings',
                'Test brake lever feel and adjust if needed',
                'Check chain tension and lubrication',
                'Verify all bolts are torqued to spec',
                'Test electronics (TC, engine brake, quick shifter)',
                'Check fuel level and quality',
                'Inspect tire condition and wear',
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 hover:bg-muted/50 rounded">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
