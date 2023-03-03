import IconButton, { IconButtonProps } from 'components/IconButton';
import { Platform, usePlatform } from 'lib/PlatformContext';
import useFunction from 'lib/useFunction';
import { MouseEvent } from 'react';

export type PlatformButtonProps = IconButtonProps & {
	value: Platform
};

export default function PlatformButton({ value, onClick, ...props }: PlatformButtonProps) {
	const [, setPlatform] = usePlatform();

	return (
		<IconButton
			onClick={
				useFunction((event: MouseEvent<HTMLButtonElement>) => {
					setPlatform(value);

					onClick?.(event);
				})
			}
			{...props}
		/>
	);
}
