import { Button } from '@/components/ui/button'

export default function ActionButton({ icon: Icon, onClick, active = false, activeColor = '#C9A84C' }) {
    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={onClick}
            className="w-11 h-11 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/40 active:scale-90 transition-transform duration-150 p-0"
        >
            <Icon
                size={20}
                color={active ? activeColor : 'white'}
                strokeWidth={active ? 2.5 : 1.8}
                fill={active ? activeColor : 'none'}
            />
        </Button>
    )
}
