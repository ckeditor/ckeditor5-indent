/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module indent/indentui
 */
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { createStaticSplitButtonToolbar } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';

import indentIcon from '../theme/icons/indent.svg';
import outdentIcon from '../theme/icons/outdent.svg';

/**
 * The indent UI feature.
 *
 * This plugin registers the `'indent'` and `'outdent'` buttons.
 *
 * **Note**: In order for the commands to work, at least one of the compatible features is required. Read more in
 * the {@link module:indent/indent~Indent indent feature} API documentation.
 *
 * @extends module:core/plugin~Plugin
 */
export default class IndentUI extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'IndentUI';
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		const locale = editor.locale;
		const componentFactory = editor.ui.componentFactory;
		const t = editor.t;

		const localizedIndentIcon = locale.uiLanguageDirection == 'ltr' ? indentIcon : outdentIcon;
		const localizedOutdentIcon = locale.uiLanguageDirection == 'ltr' ? outdentIcon : indentIcon;

		const indentLabel = t( 'Increase indent' );
		const outdentLabel = t( 'Decrease indent' );

		this._defineButton( 'indent', indentLabel, localizedIndentIcon );
		this._defineButton( 'outdent', outdentLabel, localizedOutdentIcon );

		componentFactory.add( 'indentTools', locale => {
			return createStaticSplitButtonToolbar( locale, [
				componentFactory.create( 'indent' ),
				componentFactory.create( 'outdent' )
			] );
		} );
	}

	/**
	 * Defines a UI button.
	 *
	 * @param {String} commandName
	 * @param {String} label
	 * @param {String} icon
	 * @private
	 */
	_defineButton( commandName, label, icon ) {
		const editor = this.editor;

		editor.ui.componentFactory.add( commandName, locale => {
			const command = editor.commands.get( commandName );
			const view = new ButtonView( locale );

			view.set( {
				label,
				icon,
				tooltip: true
			} );

			view.bind( 'isOn', 'isEnabled' ).to( command, 'value', 'isEnabled' );

			this.listenTo( view, 'execute', () => editor.execute( commandName ) );

			return view;
		} );
	}
}
