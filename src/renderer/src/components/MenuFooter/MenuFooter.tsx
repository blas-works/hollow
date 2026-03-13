import React, { useState, useEffect } from 'react'
import { Github } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { electronService } from '../../services/electron.service'

export function MenuFooter(): React.JSX.Element {
  const [version, setVersion] = useState<string>('...')

  useEffect(() => {
    electronService.getAppVersion().then((v) => setVersion(v))
  }, [])

  const handleGithubClick = async (): Promise<void> => {
    await electronService.openExternal('https://github.com/torrescereno/hollow')
  }

  return (
    <div className="app-no-drag mt-auto pt-4 border-t border-border">
      <div className="flex items-center justify-between gap-3 px-3">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleGithubClick}
          aria-label="Visit GitHub repository"
          className="text-muted-foreground hover:text-foreground"
        >
          <Github size={15} strokeWidth={1.5} />
        </Button>
        <span className="text-xs text-muted-foreground font-light tracking-[0.025em]">
          v{version}
        </span>
      </div>
    </div>
  )
}
