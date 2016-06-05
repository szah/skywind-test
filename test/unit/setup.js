import { jsdom } from 'jsdom';
import 'ignore-styles';

global.document = jsdom('<!doctype html><html><body></body></html>');
global.window = document.defaultView;
global.navigator = global.window.navigator;
