import { createElement, appendChildren } from '../virtual-element';
import ModalDialog from './modal-dialog';
import BackGroundButton from './background-button';
import * as Settings from '../settings';

export default class extends ModalDialog {
    constructor(element: HTMLDivElement) {
        super(element);

        appendChildren(
            this.element,
            /*<button class="background-button active">
<img src={Settings.BACKGROUND_IMAGES.white.src} alt={Settings.BACKGROUND_IMAGES.white.alt} />
</button>,
<button class="background-button">
<img src={Settings.BACKGROUND_IMAGES.wide.src} alt={Settings.BACKGROUND_IMAGES.wide.alt} />
</button>,*/
            createElement<HTMLButtonElement, BackGroundButton, BackGroundButtonProps>(BackGroundButton, {
                src: Settings.BACKGROUND_IMAGES.white.src,
                alt: Settings.BACKGROUND_IMAGES.white.alt
            })
            /*<button id="background-file-button">
  <img src={Settings.BACKGROUND_IMAGES.file.src} alt={Settings.BACKGROUND_IMAGES.file.alt} />
</button>,
<form
  id="background-file-form"
  action={Settings.BACKGROUND_FILE_ACTION_URL}
  method="POST"
  encType="multipart/form-data"
  target="background-file-iframe"
>
  <input id="background-file" name="image" type="file" accept="image/png,image/jpeg" />
</form>,
<iframe id="background-file-iframe" name="background-file-iframe"></iframe>*/
        );
    }
}
