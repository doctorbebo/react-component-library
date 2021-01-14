import React, { useCallback } from 'react';
import { Avatar, ButtonBase, Divider, Tooltip, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { PXBlueDrawerInheritableProperties, RAIL_WIDTH, RAIL_WIDTH_CONDENSED } from './Drawer';
import color from 'color';
import clsx from 'clsx';

export type DrawerRailItemClasses = {
    root?: string;
    active?: string;
    condensed?: string;
    divider?: string;
    icon?: string;
    statusStripe?: string;
    title?: string;
    titleActive?: string;
    ripple?: string;
};

export type DrawerRailItemProps = Pick<
    PXBlueDrawerInheritableProperties,
    | 'activeItemBackgroundColor'
    | 'activeItemFontColor'
    | 'activeItemIconColor'
    | 'divider'
    | 'itemFontColor'
    | 'itemIconColor'
    | 'onItemSelect'
    | 'ripple'
> & {
    activeItem?: string;

    // toggles the condensed style
    condensed?: boolean;

    // sets whether to hide the nav item
    hidden?: boolean;

    // icon on the left
    icon?: JSX.Element;

    // item id to match for the active state.
    // Should be unique within the entire list. Will be used as the list key too.
    itemID: string;

    // onClick of the entire row
    onClick?: (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;

    // Status stripe color
    statusColor?: string;

    // text to be displayed
    title: string;

    // classes for style overrides
    classes?: DrawerRailItemClasses;
};

const useStyles = makeStyles<Theme, DrawerRailItemProps>((theme: Theme) => {
    // approximates the [200] color but not perfectly because the theme does not have that explicit color
    const lightenedPrimary = color(theme.palette.primary.main)
        .lighten(0.83)
        .desaturate(0.39)
        .string();
    const fivePercentOpacityPrimary = color(theme.palette.primary.main)
        .fade(0.95)
        .string();
    const twentyPercentOpacityPrimary = color(theme.palette.primary.main)
        .fade(0.8)
        .string();

    return createStyles({
        root: {
            width: RAIL_WIDTH,
            minHeight: RAIL_WIDTH,
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: `${theme.spacing(2)}px ${theme.spacing(1)}px`,
            textAlign: 'center',
            cursor: (props): string => (props.onClick || props.onItemSelect ? 'pointer' : 'default'),
        },
        condensed: {
            width: RAIL_WIDTH_CONDENSED,
            minHeight: RAIL_WIDTH_CONDENSED,
        },
        active: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: (props): string =>
                props.itemID !== props.activeItem
                    ? 'transparent'
                    : props.activeItemBackgroundColor ||
                      (theme.palette.type === 'light' ? fivePercentOpacityPrimary : twentyPercentOpacityPrimary),
        },
        divider: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
        },
        icon: {
            color: (props): string =>
                props.itemID !== props.activeItem
                    ? props.itemIconColor || theme.palette.text.primary
                    : props.activeItemIconColor ||
                      (theme.palette.type === 'light' ? theme.palette.primary.main : lightenedPrimary),
            backgroundColor: 'transparent',
            height: 'auto',
            width: 'auto',
        },
        statusStripe: {
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            width: 6,
            zIndex: 100,
            backgroundColor: (props): string => props.statusColor,
        },
        title: {
            lineHeight: `16px`,
            wordBreak: 'break-word',
            hyphens: 'auto',
            zIndex: 200,
            color: (props): string =>
                props.itemID !== props.activeItem
                    ? props.itemFontColor || theme.palette.text.primary
                    : props.activeItemFontColor ||
                      (theme.palette.type === 'light' ? theme.palette.primary.main : lightenedPrimary),
        },
        titleActive: {
            fontWeight: 600,
        },
        ripple: {
            backgroundColor: theme.palette.primary.main,
        },
    });
});

const DrawerRailItemRender: React.ForwardRefRenderFunction<unknown, DrawerRailItemProps> = (
    props: DrawerRailItemProps,
    ref: any
) => {
    const {
        activeItem,
        classes = {},
        condensed = false,
        hidden,
        icon,
        itemID,
        onClick,
        onItemSelect,
        ripple = true,
        title,
        /* eslint-disable @typescript-eslint/no-unused-vars */
        activeItemBackgroundColor,
        activeItemFontColor,
        activeItemIconColor,
        divider,
        itemFontColor,
        itemIconColor,
        statusColor,
        /* eslint-disable @typescript-eslint/no-unused-vars */

        ...buttonBaseProps
    } = props;

    const defaultClasses = useStyles(props);

    const active = activeItem === itemID;
    const hasAction = Boolean(onItemSelect || onClick);

    // Customize the color of the Touch Ripple
    const RippleProps =
        ripple && hasAction
            ? {
                  TouchRippleProps: {
                      classes: {
                          child: defaultClasses.ripple,
                      },
                  },
              }
            : {};

    const combine = useCallback(
        (className: keyof DrawerRailItemClasses): string => clsx(defaultClasses[className], classes[className]),
        [defaultClasses, classes]
    );

    const getIcon = useCallback((): JSX.Element | undefined => {
        if (icon) {
            return <Avatar className={combine('icon')}>{icon}</Avatar>;
        }
    }, [icon, combine]);

    const onClickAction = useCallback(
        (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
            if (onItemSelect) {
                onItemSelect();
            }
            if (onClick) {
                onClick(e);
            }
        },
        [onItemSelect, onClick]
    );

    const innerContent = (
        <ButtonBase
            ref={ref}
            {...buttonBaseProps}
            className={clsx(defaultClasses.root, classes.root, {
                [defaultClasses.condensed]: condensed,
                [classes.condensed]: condensed,
            })}
            disableRipple={!ripple || !hasAction}
            onClick={onClickAction}
            {...RippleProps}
        >
            {/* Active Item Highlight */}
            {active && <div className={combine('active')} />}
            {/* Status Color Stripe */}
            <div className={combine('statusStripe')} data-test={'status-stripe'} />
            {/* Icon */}
            {getIcon()}
            {/* Title */}
            {!condensed && (
                <Typography
                    variant={'caption'}
                    className={clsx(defaultClasses.title, classes.title, {
                        [defaultClasses.titleActive]: active,
                        [classes.titleActive]: active,
                    })}
                >
                    {title}
                </Typography>
            )}
            {/* Divider */}
            {props.divider && <Divider className={combine('divider')} />}
        </ButtonBase>
    );

    return hidden ? null : condensed ? (
        <Tooltip title="Add" placement="right">
            {innerContent}
        </Tooltip>
    ) : (
        innerContent
    );
};

export const DrawerRailItem = React.forwardRef(DrawerRailItemRender);
DrawerRailItem.displayName = 'DrawerRailItem';
