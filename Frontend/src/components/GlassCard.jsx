import { animate } from 'motion/react'
import React from 'react'

const GlassCard = ({
    children,
    className = '',
    hover = false,
    onClick
}) => {
    const component = hover ? 'motion.div' : 'div'
    return (

        <component
            className={`
            backdrop-blur-md bg-card/40  border border-border/50
            rounded-xl transition-all duration-300
            ${hover ? 'cursor-pointer hover:shadow-[0_0_20px_#D4AF3740] hover:translate-y-1 ' : ''}
            ${className}`}
            onClick={onClick}
            {...(hover
                ? {
                    whileHover: { y: -4 },
                    transition: { duration: 0.3 },
                }
                : {})}
        >
            {children}
        </component>
    )
}

export { GlassCard }
