const input: HTMLInputElement | null = document.querySelector('#input');

if (!input) {
    throw new Error("Couldn't get input. ");
}

const img: HTMLImageElement | null = document.querySelector('#img');

if (!img) {
    throw new Error("Couldn't get img. ");
}

input.onchange = (): void => {
    if (input.files !== null && input.files.length == 1) {
        const reader = new FileReader();

        reader.onloadend = (): void => {
            if (reader.error !== null) {
                throw reader.error;
            }
            if (typeof reader.result != 'string') {
                throw new Error('Unexpected result type. ');
            }

            const image = new Image();
            image.src = reader.result;
            image.onload = (): void => {
                const canvas = document.createElement('canvas');

                canvas.width = Math.round(Math.max(image.naturalWidth, (image.naturalHeight / 9) * 16));
                canvas.height = Math.round(Math.max(image.naturalHeight, (image.naturalWidth / 16) * 9));

                const context = canvas.getContext('2d');

                if (!context) {
                    throw new Error("Couldn't get context. ");
                }

                context.fillStyle = '#808080';
                context.fillRect(0, 0, canvas.width, canvas.height);
                context.drawImage(
                    image,
                    Math.round((canvas.width - image.naturalWidth) / 2),
                    Math.round((canvas.height - image.naturalHeight) / 2)
                );

                img.src = canvas.toDataURL();
            };
        };
        reader.readAsDataURL(input.files[0]);
    }
};
