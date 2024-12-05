import "./index.css";

import { IconQuote } from "@codexteam/icons";
import { make } from "@editorjs/dom";
import type { API, BlockAPI, BlockTool, ToolConfig } from "@editorjs/editorjs";
import { MenuConfig } from "@editorjs/editorjs/types/tools";

/**
 * Configuration interface for the Quote tool.
 */
export interface QuoteConfig extends ToolConfig {
  defaultType: QuoteType;
}

/**
 * Data structure for the Quote block.
 */
export interface QuoteData {
  text: string;
  type: QuoteType;
}

/**
 * Parameters for the Quote constructor.
 */
interface QuoteParams {
  data: QuoteData;
  config: QuoteConfig;
  api: API;
  readOnly: boolean;
  block: BlockAPI;
}

/**
 * CSS class names used in the Quote block.
 */
interface QuoteCSS {
  baseClass: string;
  wrapper: string;
  input: string;
  text: string;
}

/**
 * Enum for the different types of quotes.
 */
enum QuoteType {
  QuotationMark = "quotationMark",
  VerticalLine = "verticalLine",
  Box = "box",
}

/**
 * Quote class representing a customizable quote block for Editor.js.
 */
export default class Quote implements BlockTool {
  api: API;
  readOnly: boolean;

  private _block: BlockAPI;
  private _data: QuoteData;
  private _CSS: QuoteCSS;
  private _quoteElement!: HTMLElement;

  /**
   * Creates an instance of the Quote block.
   * @param params - The parameters for the Quote block.
   */
  constructor({ data, config, api, readOnly, block }: QuoteParams) {
    const { DEFAULT_TYPE } = Quote;

    this.api = api;
    this.readOnly = readOnly;

    this._data = {
      text: data.text || "",
      type:
        (Object.values(QuoteType).includes(data.type as QuoteType) &&
          data.type) ||
        config.defaultType ||
        DEFAULT_TYPE,
    };

    this._CSS = {
      baseClass: this.api.styles.block,
      wrapper: "cdx-quote",
      text: "cdx-quote__text",
      input: this.api.styles.input,
    };
    this._block = block;
  }

  static get isReadOnlySupported(): boolean {
    return true;
  }

  static get toolbox() {
    return {
      icon: IconQuote,
      title: "Quote",
    };
  }

  static get contentless(): boolean {
    return true;
  }

  static get enableLineBreaks(): boolean {
    return true;
  }

  static get DEFAULT_TYPE(): QuoteType {
    return QuoteType.QuotationMark;
  }

  static get conversionConfig() {
    return {
      import: "text",

      export: function (quoteData: QuoteData): string {
        return quoteData.text;
      },
    };
  }

  /**
   * Gets the CSS class names for the quote block.
   */
  get CSS(): QuoteCSS {
    return {
      baseClass: this.api.styles.block,
      wrapper: "cdx-quote",
      text: "cdx-quote__text",
      input: this.api.styles.input,
    };
  }

  /**
   * Gets the settings for the quote block.
   */
  get settings(): { name: QuoteType; label: string; icon?: string }[] {
    return [
      {
        name: QuoteType.QuotationMark,
        label: "Quote Mark",
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="editor-icon"><path id="Vector" d="M13.4831 16L12.9348 15.2444C13.6348 14.7628 14.2457 14.168 14.7411 13.4856C15.1102 12.9691 15.3133 12.3568 15.3244 11.7268L15.3244 11.5341C15.1838 11.5523 15.0551 11.5683 14.9383 11.5821C14.8287 11.5955 14.7184 11.6026 14.6079 11.6032C14.379 11.6097 14.1512 11.5704 13.9384 11.4876C13.7256 11.4048 13.5324 11.2803 13.3708 11.1218C13.2095 10.9659 13.0826 10.7794 12.9979 10.5738C12.9132 10.3682 12.8725 10.1478 12.8783 9.92622C12.8654 9.67057 12.9047 9.41498 12.994 9.17437C13.0833 8.93376 13.2207 8.71295 13.3983 8.52485C13.5784 8.34918 13.7938 8.21199 14.031 8.12199C14.2682 8.03198 14.5219 7.99112 14.7761 8.00199C15.0814 7.99561 15.3842 8.05802 15.6609 8.18438C15.9376 8.31074 16.1809 8.49766 16.3718 8.73067C16.8042 9.25948 17.0264 9.92326 16.9975 10.5996C16.9991 11.6387 16.6913 12.6558 16.1115 13.5267C15.4258 14.5249 14.5296 15.3682 13.4831 16ZM8.57836 16L8.03081 15.2444C8.73082 14.7628 9.34168 14.168 9.83712 13.4856C10.2062 12.9691 10.4093 12.3568 10.4204 11.7268L10.4204 11.5341C10.2894 11.5523 10.1652 11.5683 10.0477 11.5821C9.93338 11.5959 9.81836 11.6029 9.70321 11.6032C9.47579 11.612 9.24899 11.5743 9.03726 11.4927C8.82554 11.4111 8.63353 11.2872 8.47347 11.129C8.31679 10.9694 8.1944 10.7808 8.11352 10.5742C8.03264 10.3676 7.99491 10.1473 8.00255 9.9262C7.97599 9.41221 8.15775 8.90869 8.50843 8.52483C8.68516 8.34862 8.89803 8.21093 9.13304 8.12082C9.36806 8.03072 9.61992 7.99022 9.87208 8.00199C10.1793 7.99665 10.4838 8.05945 10.7626 8.18565C11.0414 8.31186 11.2874 8.4982 11.482 8.73067C11.9225 9.25585 12.1503 9.92102 12.1218 10.5996C12.1182 11.6281 11.808 12.6333 11.229 13.4922C10.5339 14.4995 9.63105 15.3538 8.57836 16Z" fill="#12161A"/></g></svg>`,
      },
      {
        name: QuoteType.VerticalLine,
        label: "Vertical Line",
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="editor-icon"><path id="Vector" fill-rule="evenodd" clip-rule="evenodd" d="M5 5V19H7V5H5ZM18.3198 7H9.68019L9.01941 10.3039L10.9806 10.6961L11.3198 9H13V15.5H11V17.5H17V15.5H15V9H16.6802L17.0194 10.6961L18.9806 10.3039L18.3198 7Z" fill="#12161A"/></g></svg>`,
      },
      {
        name: QuoteType.Box,
        label: "Box",
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="editor-icon"><path id="Vector" fill-rule="evenodd" clip-rule="evenodd" d="M17 7H7V17H17V7ZM5 5V19H19V5H5Z" fill="#12161A"/></g></svg>`,
      },
    ];
  }

  /**
   * Renders the quote block element.
   * @returns The HTML element representing the quote block.
   */
  render(): HTMLElement {
    const container = make("div", [this._CSS.baseClass, this._CSS.wrapper]);
    this._quoteElement = make(
      "blockquote",
      [this._CSS.input, this._CSS.text, this.getTypeClass(this._data.type)],
      {
        contentEditable: !this.readOnly,
        innerHTML: this._data.text,
      }
    );

    this._quoteElement.addEventListener("keydown", (event: KeyboardEvent) =>
      this.handleKeydown(event)
    );

    container.appendChild(this._quoteElement);
    return container;
  }

  /**
   * Gets the current item in the quote block.
   * @returns The HTML element representing the current item.
   */
  get currentItem(): HTMLElement {
    let currentNode = window.getSelection()!.anchorNode;

    if (currentNode!.nodeType !== Node.ELEMENT_NODE) {
      currentNode = currentNode!.parentNode;
    }

    return (currentNode as Element).closest(`.${this.CSS.text}`) as HTMLElement;
  }

  /**
   * Handles keydown events in the quote block.
   * @param event - The keyboard event.
   */
  handleKeydown(event: KeyboardEvent) {
    const currentItem = this._quoteElement;

    if (event.key === "Enter") {
      if (!event.shiftKey) {
        event.preventDefault();
        this.getOutOfQuote();
      }
    }

    if (
      event.key === "Backspace" &&
      currentItem.textContent?.trim().length === 0
    ) {
      event.preventDefault();

      const currentBlockIndex = this.api.blocks.getCurrentBlockIndex();
      this.api.blocks.delete(currentBlockIndex);
      this.api.blocks.insert("paragraph", { text: "" });
      this.api.caret.setToBlock(currentBlockIndex);

      return;
    }
  }

  /**
   * Exits the quote block and moves the caret to the next block.
   */
  getOutOfQuote() {
    this.api.blocks.insert();
    this.api.caret.setToBlock(this.api.blocks.getCurrentBlockIndex());
  }

  /**
   * Gets the CSS class for the specified quote type.
   * @param type - The type of the quote.
   * @returns The CSS class name for the quote type.
   */
  getTypeClass(type: QuoteType): string {
    switch (type) {
      case QuoteType.QuotationMark:
        return "blockquote_type1";
      case QuoteType.VerticalLine:
        return "blockquote_type2";
      case QuoteType.Box:
        return "blockquote_type3";
      default:
        return "blockquote_type1";
    }
  }

  /**
   * Saves the quote data from the quote element.
   * @param quoteElement - The HTML element representing the quote block.
   * @returns The saved quote data.
   */
  save(quoteElement: HTMLDivElement): QuoteData {
    const text = quoteElement.querySelector(`.${this._CSS.text}`);

    return Object.assign(this._data, {
      text: text?.innerHTML ?? "",
    });
  }

  static get sanitize() {
    return {
      text: {
        br: true,
      },
    };
  }

  /**
   * Renders the settings for the quote block.
   * @returns An array of settings for the quote block.
   */
  renderSettings(): HTMLElement | MenuConfig {
    return this.settings.map((item) => ({
      icon: item.icon || undefined,
      label: this.api.i18n.t(item.label),
      onActivate: () => this._toggleTune(item.name),
      isActive: this._data.type === item.name,
      closeOnActivate: true,
    }));
  }

  /**
   * Toggles the quote type.
   * @param tune - The new type to set for the quote block.
   */
  _toggleTune(tune: QuoteType) {
    this._data.type = tune;

    if (this._quoteElement) {
      this._quoteElement.classList.remove(
        "blockquote_type1",
        "blockquote_type2",
        "blockquote_type3"
      );

      this._quoteElement.classList.add(this.getTypeClass(tune));
    }

    this._block.dispatchChange();
  }
}
