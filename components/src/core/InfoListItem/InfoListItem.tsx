import React, { ReactNode, useCallback } from 'react';
import { Avatar, Divider, ListItem, ListItemAvatar, ListItemText, Typography, ListItemProps } from '@material-ui/core';
import Chevron from '@material-ui/icons/ChevronRight';

import { InfoListItemClasses, useStyles } from './InfoListItem.styles';

import { separate, withKeys } from '../utilities';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const MAX_SUBTITLE_ELEMENTS = 6;

export type DividerType = 'full' | 'partial';
export type InfoListItemProps = Omit<ListItemProps, 'title' | 'divider'> & {
    avatar?: boolean;
    backgroundColor?: string;
    chevron?: boolean;
    classes?: InfoListItemClasses;
    divider?: DividerType;
    fontColor?: string;
    hidePadding?: boolean;
    icon?: JSX.Element;
    iconColor?: string;
    iconAlign?: 'left' | 'center' | 'right';
    info?: string | Array<string | JSX.Element>;
    leftComponent?: ReactNode;
    rightComponent?: ReactNode;
    ripple?: boolean;
    statusColor?: string;
    subtitle?: string | Array<string | JSX.Element>;
    subtitleSeparator?: string;
    title: ReactNode;
    wrapInfo?: boolean;
    wrapSubtitle?: boolean;
    wrapTitle?: boolean;
};
const InfoListItemRender: React.ForwardRefRenderFunction<unknown, InfoListItemProps> = (
    props: InfoListItemProps,
    ref: any
) => {
    const defaultClasses = useStyles(props);
    const {
        avatar,
        button,
        chevron,
        classes,
        divider,
        hidePadding,
        icon,
        leftComponent,
        rightComponent,
        ripple,
        subtitle,
        subtitleSeparator,
        info,
        title,
        wrapInfo,
        wrapSubtitle,
        wrapTitle,
        // ignore unused vars so that we can do prop transferring to the root element
        /* eslint-disable @typescript-eslint/no-unused-vars */
        backgroundColor,
        fontColor,
        iconAlign,
        iconColor,
        statusColor,
        /* eslint-enable @typescript-eslint/no-unused-vars */
        ...otherListItemProps
    } = props;

    const combine = useCallback(
        (className: keyof InfoListItemClasses): string => clsx(defaultClasses[className], classes[className]),
        [defaultClasses, classes]
    );

    const getIcon = useCallback((): JSX.Element | undefined => {
        if (icon) {
            return (
                <ListItemAvatar style={{ minWidth: 'unset' }}>
                    <Avatar className={combine(avatar ? 'avatar' : 'icon')}>{icon}</Avatar>
                </ListItemAvatar>
            );
        } else if (!hidePadding) {
            return (
                // a dummy component to maintain the padding
                <ListItemAvatar style={{ minWidth: 'unset' }}>
                    <Avatar className={clsx(defaultClasses.avatar, defaultClasses.invisible)} />
                </ListItemAvatar>
            );
        }
    }, [icon, avatar, hidePadding, combine]);

    const getRightComponent = useCallback((): JSX.Element | undefined => {
        if (rightComponent) {
            return <div className={combine('rightComponent')}>{rightComponent}</div>;
        } else if (chevron) {
            return (
                <Chevron
                    color={'inherit'}
                    role={'button'}
                    className={clsx(combine('rightComponent'), defaultClasses.flipIcon)}
                />
            );
        }
    }, [rightComponent, chevron, combine]);

    const getSeparator = useCallback(
        (): JSX.Element => (
            <Typography className={combine('separator')} component={'span'}>
                {subtitleSeparator || '\u00B7'}
            </Typography>
        ),
        [combine, subtitleSeparator]
    );

    const getSubtitle = useCallback((): string | null => {
        if (!subtitle) {
            return null;
        }
        if (typeof subtitle === 'string') {
            return subtitle;
        }

        const subtitleParts = Array.isArray(subtitle) ? [...subtitle] : [subtitle];
        const renderableSubtitleParts = subtitleParts.splice(0, MAX_SUBTITLE_ELEMENTS);

        return withKeys(separate(renderableSubtitleParts, () => getSeparator()));
    }, [subtitle, getSeparator]);

    const getInfo = useCallback((): string | null => {
        if (!info) {
            return null;
        }
        if (typeof info === 'string') {
            return info;
        }

        const infoParts = Array.isArray(info) ? [...info] : [info];
        const renderableInfoParts = infoParts.splice(0, MAX_SUBTITLE_ELEMENTS);

        return withKeys(separate(renderableInfoParts, () => getSeparator()));
    }, [info, getSeparator]);

    const hasRipple = button === undefined ? (props.onClick && ripple ? true : undefined) : button ? true : undefined;

    return (
        // @ts-ignore
        <ListItem button={hasRipple} className={combine('root')} ref={ref} {...otherListItemProps}>
            <div className={combine('statusStripe')} data-test={'status-stripe'} />
            {divider && <Divider className={combine('divider')} />}
            {(icon || !hidePadding) && getIcon()}
            {leftComponent}
            <ListItemText
                primary={title}
                className={combine('listItemText')}
                secondary={
                    <>
                        <Typography
                            variant={'subtitle2'}
                            component={'p'}
                            noWrap={!wrapSubtitle}
                            className={combine('subtitle')}
                        >
                            {getSubtitle()}
                        </Typography>
                        <Typography variant={'body2'} noWrap={!wrapInfo} className={combine('info')}>
                            {getInfo()}
                        </Typography>
                    </>
                }
                primaryTypographyProps={{
                    noWrap: !wrapTitle,
                    variant: 'body1',
                    className: combine('title'),
                }}
                secondaryTypographyProps={{
                    variant: 'subtitle2',
                    color: 'textPrimary',
                }}
            />
            {getRightComponent()}
        </ListItem>
    );
};
export const InfoListItem = React.forwardRef(InfoListItemRender);

InfoListItem.displayName = 'InfoListItem';
InfoListItem.propTypes = {
    avatar: PropTypes.bool,
    backgroundColor: PropTypes.string,
    chevron: PropTypes.bool,
    classes: PropTypes.shape({
        root: PropTypes.string,
        avatar: PropTypes.string,
        icon: PropTypes.string,
        rightComponent: PropTypes.string,
        separator: PropTypes.string,
        subtitle: PropTypes.string,
        title: PropTypes.string,
    }),
    divider: PropTypes.oneOf(['full', 'partial']),
    fontColor: PropTypes.string,
    hidePadding: PropTypes.bool,
    icon: PropTypes.element,
    iconAlign: PropTypes.oneOf(['left', 'right', 'center']),
    iconColor: PropTypes.string,
    info: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.element])),
    ]),
    leftComponent: PropTypes.node,
    rightComponent: PropTypes.node,
    statusColor: PropTypes.string,
    style: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
    subtitle: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.element])),
    ]),
    subtitleSeparator: PropTypes.string,
    title: PropTypes.node.isRequired,
    wrapInfo: PropTypes.bool,
    wrapSubtitle: PropTypes.bool,
    wrapTitle: PropTypes.bool,
};

InfoListItem.defaultProps = {
    avatar: false,
    chevron: false,
    classes: {},
    dense: false,
    hidePadding: false,
    iconAlign: 'left',
    ripple: false,
    subtitleSeparator: '\u00B7',
    wrapInfo: false,
    wrapSubtitle: false,
    wrapTitle: false,
};
