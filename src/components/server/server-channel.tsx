'use client'

import { Channel, ChannelType, MemberRole, Server } from '@prisma/client'
import { FC } from 'react'
import { Edit, Hash, Lock, Mic, Trash, Video } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { EGeneral } from '@/types'
import { ActionTooltip } from '@/components/action-tooltip'

interface IServerChannelProps {
  channel: Channel
  server: Server
  role?: MemberRole
}

const iconMap = {
  [ChannelType.TEXT]: Hash,
  [ChannelType.AUDIO]: Mic,
  [ChannelType.VIDEO]: Video,
}

export const ServerChannel: FC<IServerChannelProps> = ({ channel, server, role }) => {
  const params = useParams()
  const router = useRouter()

  const Icon = iconMap[channel.type]

  return (
    <button
      onClick={() => {}}
      className={cn(
        'group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1',
        params?.channelId === channel.id && 'bg-zinc-700/20 dark:bg-zinc-700/60',
      )}>
      <Icon className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400" />
      <p
        className={cn(
          'line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition',
          params?.channelId === channel.id && 'text-primary dark:text-zinc-200 dark:group-hover:text-white',
        )}>
        {channel.name}
      </p>
      {channel.name !== EGeneral.GENERAL && role !== 'GUEST' && (
        <div className="ml-auto flex items-center gap-x-2">
          <ActionTooltip label={'Edit'}>
            <Edit className="hidden group-hover:block h-4 w-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition" />
          </ActionTooltip>
          <ActionTooltip label={'Delete'}>
            <Trash className="hidden group-hover:block h-4 w-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition" />
          </ActionTooltip>
        </div>
      )}
      {channel.name === EGeneral.GENERAL && <Lock className="ml-auto h-4 w-4 text-zinc-500 dark:text-zinc-400 " />}
    </button>
  )
}
