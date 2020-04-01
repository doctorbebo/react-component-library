import React, { useCallback } from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import clsx from 'clsx';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: 'inline-flex',
        alignItems: 'center',
        lineHeight: 1.2,
    },
    icon: {
        marginRight: theme.spacing(0.5),
        display: 'inline',
        fontSize: 'inherit',
    },
    text: {
        fontSize: 'inherit',
        lineHeight: 'inherit',
        letterSpacing: 0,
    },
    units: {
        fontWeight: 300,
    },
    value: {
        fontWeight: 600,
    },
}));

export type ChannelValueClasses = {
    root?: string;
    icon?: string;
    units?: string;
    value?: string;
};
export type ChannelValueProps = {
    classes?: ChannelValueClasses;
    color?: string;
    fontSize?: number | string;
    icon?: JSX.Element;
    prefix?: boolean;
    units?: string;
    value: number | string;
};

export const ChannelValue: React.FC<ChannelValueProps> = (props) => {
    const { classes = {}, color = 'inherit', fontSize = 'inherit', icon, prefix = false, units, value } = props;
    const defaultClasses = useStyles(useTheme());

    const getUnitElement = useCallback(
        (): JSX.Element => (
            <>
                {units && (
                    <Typography
                        variant={'h6'}
                        color={'inherit'}
                        className={clsx(defaultClasses.text, defaultClasses.units, classes.units)}
                        data-test={'units'}
                    >
                        {units}
                    </Typography>
                )}
            </>
        ),
        [units, classes]
    );

    const changeIconDisplay = (newIcon: JSX.Element): JSX.Element =>
        React.cloneElement(newIcon, {
            style: Object.assign({}, newIcon.props.style, { display: 'block', fontSize: 'inherit' }),
        });

    return (
        <span className={clsx(defaultClasses.root, classes.root)} style={{ fontSize, color }} data-test={'wrapper'}>
            {icon && (
                <span className={clsx(defaultClasses.icon, classes.icon)} data-test={'icon'}>
                    {changeIconDisplay(icon)}
                </span>
            )}
            {prefix && getUnitElement()}
            <Typography
                variant={'h6'}
                color={'inherit'}
                className={clsx(defaultClasses.text, defaultClasses.value, classes.value)}
                data-test={'value'}
            >
                {value}
            </Typography>
            {!prefix && getUnitElement()}
        </span>
    );
};

ChannelValue.displayName = 'ChannelValue';
