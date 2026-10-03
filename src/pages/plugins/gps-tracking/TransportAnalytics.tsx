import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { DownloadIcon, TrendingUpIcon } from 'lucide-react';
export function TransportAnalytics() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Transport Analytics
          </h1>
          <p className="text-sm text-gray-500">
            Insights on fleet performance, fuel usage and route efficiency
          </p>
        </div>
        <Button variant="primary">
          <DownloadIcon className="w-4 h-4 mr-2" />
          Export Analytics
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-gray-900">98.2%</p>
            <p className="text-sm text-gray-500">On-Time Rate</p>
            <p className="text-xs text-green-600">↑ 2.1% this month</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-blue-600">4,821 km</p>
            <p className="text-sm text-gray-500">Total Distance (Month)</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-orange-600">342 L</p>
            <p className="text-sm text-gray-500">Fuel Consumed</p>
          </div>
        </Card>
        <Card>
          <div className="p-2">
            <p className="text-2xl font-bold text-purple-600">14.1 km/L</p>
            <p className="text-sm text-gray-500">Avg. Fuel Efficiency</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Route Performance">
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="text-sm font-medium">Route A - North Zone</span>
              <div className="flex items-center gap-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: '98%'
                    }} />

                </div>
                <span className="text-sm text-gray-600">98%</span>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="text-sm font-medium">Route B - South Zone</span>
              <div className="flex items-center gap-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{
                      width: '87%'
                    }} />

                </div>
                <span className="text-sm text-gray-600">87%</span>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="text-sm font-medium">Route C - East Zone</span>
              <div className="flex items-center gap-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: '95%'
                    }} />

                </div>
                <span className="text-sm text-gray-600">95%</span>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Monthly Trip Summary">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-blue-50 rounded-lg text-center">
                <p className="text-xl font-bold text-blue-700">486</p>
                <p className="text-xs text-blue-600">Total Trips</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg text-center">
                <p className="text-xl font-bold text-green-700">477</p>
                <p className="text-xs text-green-600">On Time</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg text-center">
                <p className="text-xl font-bold text-orange-700">9</p>
                <p className="text-xs text-orange-600">Delayed</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg text-center">
                <p className="text-xl font-bold text-red-700">0</p>
                <p className="text-xs text-red-600">Cancelled</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>);

}