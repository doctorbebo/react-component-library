import { DropdownToolbar } from '@pxblue/react-components';
import { StoryFnReactReturnType } from '@storybook/react/dist/client/preview/types';
import React from 'react';
import { WITH_MIN_PROPS_STORY_NAME } from '../../src/constants';
import { text } from '@storybook/addon-knobs';
import { AppBar } from '@material-ui/core';
import { action } from '@storybook/addon-actions';
import { getDirection } from '@pxblue/storybook-rtl-addon';

export const withBasicUsage = (): StoryFnReactReturnType => {
    const direction = getDirection();
    const menuItems = [
        { title: 'Item 1', onClick: action('Item 1 selected') },
        { title: 'Item 2', onClick: action('Item 2 selected') },
        { title: 'Item 3', onClick: action('Item 3 selected') },
    ];

    const menuGroups = [
        {
            items: menuItems,
        },
    ];

    return (
        <AppBar color={'primary'}>
            <DropdownToolbar
                title={text('title', 'Title')}
                subtitle={text('subtitle', 'Subtitle')}
                menuGroups={menuGroups}
                MenuProps={{
                    anchorOrigin: { horizontal: direction === 'rtl' ? 'right' : 'left', vertical: 'bottom' },
                    transformOrigin: { horizontal: direction === 'rtl' ? 'right' : 'left', vertical: 'top' },
                }}
            ></DropdownToolbar>
        </AppBar>
    );
};

withBasicUsage.story = { name: WITH_MIN_PROPS_STORY_NAME };
