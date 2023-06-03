import { DesignSystem } from '@microsoft/fast-foundation';
import { designSystem } from '../../design-system.js';
import Template from './fixtures/base.html';
import welcome from './define.js';

DesignSystem.getOrCreate().withPrefix(designSystem.prefix).register(welcome());

export default {
	title: 'welcome',
};

export const Welcome: () => '*.html' = () => Template;
