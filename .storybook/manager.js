import { addons } from 'storybook/manager-api';
import { themes } from 'storybook/theming';

// Dark Storybook UI — matches the dark-fantasy interface we're building.
addons.setConfig({ theme: themes.dark });
