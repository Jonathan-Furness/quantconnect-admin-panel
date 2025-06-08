'use client'
import { ChartType, ChartValue } from '@/types/chart'
import { asCurrency, asPercentage } from '@/utils/formatters'
import { DatePicker, Select } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'
import { Option } from 'payload'
import { useState } from 'react'
import {
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
  ReferenceLine,
  CartesianGrid,
} from 'recharts'

interface ValuesGraphClientProps {
  data: ChartValue[]
  type: ChartType
  initialStart: string | Date
  initialEnd: string | Date
}

const ChartTypeSelector = ({ type }: Pick<ValuesGraphClientProps, 'type'>) => {
  const { replace } = useRouter()
  const [value, setValue] = useState<Option>({
    label: type === 'values' ? 'Values' : 'Percent',
    value: type satisfies ChartType,
  })
  return (
    <div style={{ width: '150px' }}>
      <Select
        value={value as any}
        onChange={(option) => {
          if (option && !Array.isArray(option)) {
            setValue(option as Option)
            const params = new URLSearchParams(location.search)
            params.set('type', (option as Record<'value', string>).value)
            replace(`${location.href.split('?')[0]}?${params.toString()}`)
          }
        }}
        options={[
          { label: 'Values', value: 'values' satisfies ChartType },
          { label: 'Percent', value: 'percent' satisfies ChartType },
        ]}
      />
    </div>
  )
}

const DateRangeSelector = ({
  initialStart,
  initialEnd,
}: Pick<ValuesGraphClientProps, 'initialStart' | 'initialEnd'>) => {
  const { replace } = useRouter()
  const [startDate, setStartDate] = useState<Date | null>(new Date(initialStart))
  const [endDate, setEndDate] = useState<Date | null>(new Date(initialEnd))
  const onChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
    const params = new URLSearchParams(location.search)

    if (start && end) {
      params.set('start', start.toISOString())
      params.set('end', end.toISOString())
      replace(`${location.href.split('?')[0]}?${params.toString()}`)
    }
  }
  return (
    <div style={{ display: 'flex' }}>
      <DatePicker overrides={{ selectsRange: true, onChange, startDate, endDate }} />
    </div>
  )
}

export const ValuesGraphClient = ({
  type,
  data,
  initialStart,
  initialEnd,
}: ValuesGraphClientProps) => {
  return (
    <div className="graph-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <DateRangeSelector initialStart={initialStart} initialEnd={initialEnd} />
        <ChartTypeSelector type={type} />
      </div>
      <ResponsiveContainer width="100%" height={'100%'}>
        <ComposedChart data={data} margin={{ top: 0, bottom: 0, left: 20, right: 0 }}>
          <CartesianGrid strokeOpacity={0.2} strokeDasharray={'4'} />
          <Area dataKey="value" type={'monotone'} fillOpacity={0.2} />
          <Bar dataKey={'change'} barSize={5}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.change >= 0 ? '#4CAF50' : '#FF5252'} />
            ))}
          </Bar>
          <YAxis
            type="number"
            tickFormatter={(value: number) =>
              type === 'percent' ? asPercentage(value) : asCurrency(value)
            }
          />
          <XAxis
            dataKey="date"
            type="number"
            scale={'time'}
            domain={['auto', 'auto']}
            padding={{ left: 0, right: 0 }}
            tickFormatter={(value: string) => new Date(value).toLocaleDateString()}
            tickLine={false}
            axisLine={false}
          />
          <ReferenceLine y={0} />
          <Tooltip
            labelStyle={{ color: 'black' }}
            labelFormatter={(value) => new Date(value).toLocaleDateString()}
            formatter={(value: number) =>
              type === 'percent' ? asPercentage(value) : asCurrency(value)
            }
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
