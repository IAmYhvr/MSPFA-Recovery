import IconButton, { IconButtonProps } from 'components/IconButton';
import { Browser, useBrowser } from 'lib/BrowserContext';
import useFunction from 'lib/useFunction';
import { MouseEvent } from 'react';

export type BrowserButtonProps = IconButtonProps & {
	value: Browser
};

export default function BrowserButton({ value, onClick, ...props }: BrowserButtonProps) {
	const [, setBrowser] = useBrowser();

	return (
		<IconButton
			onClick={
				useFunction((event: MouseEvent<HTMLButtonElement>) => {
					setBrowser(value);

					onClick?.(event);
				})
			}
			{...props}
		/>
	);
}
