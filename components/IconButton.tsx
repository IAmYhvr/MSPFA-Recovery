import { Icon } from '@iconify/react';
import { ButtonHTMLAttributes } from 'react';

export type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	label: string,
	children: string
};

export default function IconButton({ label, children, ...props }: IconButtonProps) {
	const sources = children.split(' ').filter(Boolean);

	const size = sources.length === 1 ? 90 : 50;

	return (
		<button className="icon-button" {...props}>
			<div className="icon-button-icons">
				{sources.map(source => (
					source.includes('.') ? (
						<img key={source} src={source} width={size} height={size} alt={label} />
					) : (
						<Icon key={source} icon={source} width={size} height={size} inline />
					)
				))}
			</div>
			<p className="icon-button-label">
				{label}
			</p>
		</button>
	);
}
