const favicon = () => {
    const current = document.querySelector('link[rel~="icon"]');

    if (current) {
        return current;
    }

    const link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);

    return link;
};

const label = value => (value > 99 ? '99+' : `${value}`);

const drawLabel = (context, value, size) => {
    const radius = size * 0.34;
    const center = size - radius;

    context.fillStyle = '#d63638';
    context.beginPath();
    context.arc(center, center, radius, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = '#fff';
    context.font = `700 ${value > 99 ? size * 0.25 : size * 0.32}px sans-serif`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(label(value), center, center + 1);
};

export default class FaviconBadge {
    constructor() {
        this.link = typeof document === 'undefined' ? null : favicon();
        this.originalHref = this.link?.href || null;
        this.request = 0;
    }

    badge(value) {
        if (!this.link) {
            return;
        }

        const unread = Number(value) || 0;
        this.request++;

        if (!unread) {
            if (this.originalHref) {
                this.link.href = this.originalHref;
            } else {
                this.link.removeAttribute('href');
            }

            return;
        }

        this.draw(unread, this.request);
    }

    draw(value, request) {
        if (!this.originalHref) {
            this.updateFallback(value, request);

            return;
        }

        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.onload = () => this.updateWithImage(image, value, request);
        image.onerror = () => this.updateFallback(value, request);
        image.src = this.originalHref;
    }

    updateWithImage(image, value, request) {
        if (request !== this.request) {
            return;
        }

        const size = 32;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const context = canvas.getContext('2d');

        context.drawImage(image, 0, 0, size, size);
        drawLabel(context, value, size);
        this.link.href = canvas.toDataURL('image/png');
    }

    updateFallback(value, request) {
        if (request !== this.request) {
            return;
        }

        const size = 32;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const context = canvas.getContext('2d');

        drawLabel(context, value, size);
        this.link.href = canvas.toDataURL('image/png');
    }
}
