import { Switch } from '@heroui/react'
import { useTheme } from '@heroui/use-theme'
import { MoonIcon, SunIcon } from '@components/icons'

export default function SwitchMode() {
  const { theme, setTheme } = useTheme()

  const getPrefersDark = () =>
    window.matchMedia?.('(prefers-color-scheme: dark)').matches

  return (
    <>
      <div>
        <Switch
          defaultSelected={getPrefersDark()}
          isSelected={theme === 'dark'}
          color="default"
          endContent={<MoonIcon />}
          size="md"
          startContent={<SunIcon />}
          onValueChange={(value) => {
            setTheme(value ? 'dark' : 'light')
          }}
        ></Switch>
      </div>
    </>
  )
}
