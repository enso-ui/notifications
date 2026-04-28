<script>
import { debounce } from 'lodash-es';
import eventBus from '@enso-ui/ui/src/core/services/eventBus';
import format from '@enso-ui/ui/src/modules/plugins/date-fns/format';
import formatDistance from '@enso-ui/ui/src/modules/plugins/date-fns/formatDistance';
import { app } from '@enso-ui/ui/src/pinia/app';
import { websockets } from '@enso-ui/ui/src/pinia/websockets';
import FaviconBadge from '../../services/FaviconBadge';

export default {
    name: 'Notifications',

    inject: ['errorHandler', 'http', 'route', 'routerErrorHandler', 'toastr'],

    props: {
        favicoAnimation: {
            type: String,
            default: 'popFade',
        },
        paginate: {
            type: Number,
            default: 200,
        },
    },

    data: v => ({
        favico: new FaviconBadge(),
        notifications: [],
        unread: 0,
        needsUpdate: true,
        offset: 0,
        loading: false,
        echo: null,
        desktopNotifications: false,
    }),

    computed: {
        channels() {
            return websockets().channels;
        },
    },

    watch: {
        unread(unread) {
            this.favico.badge(unread);
        },
    },

    created() {
        this.fetch = debounce(this.fetch, 500);
        this.initDesktopNotification();
        this.count();
        this.addBusListeners();
        this.connect()
            .then(() => this.listen());
    },

    methods: {
        addBusListeners() {
            eventBus.$on('read-notification', notification => {
                this.unread = Math.max(--this.unread, 0);
                const existing = this.notifications
                    .find(({ id }) => id === notification.id);

                if (existing) {
                    existing.read_at = notification.read_at;
                }
            });

            eventBus.$on('read-all-notifications', () => this.updateAll());

            eventBus.$on('destroy-notification', notification => {
                if (!notification.read_at) {
                    this.unread = Math.max(--this.unread, 0);
                }

                const index = this.notifications
                    .findIndex(({ id }) => id === notification.id);

                if (index >= 0) {
                    this.notifications.splice(index, 1);
                }
            });

            eventBus.$on('destroy-all-notifications', () => {
                this.notifications = [];
                this.unread = 0;
            });
        },
        computeScrollPosition(event) {
            const a = event.target.scrollTop;
            const b = event.target.scrollHeight - event.target.clientHeight;

            if (a / b > 0.7) {
                this.needsUpdate = true;
                this.fetch();
            }
        },
        connect() {
            return websockets().connect(app().meta.csrfToken);
        },
        count() {
            this.http.get(this.route('core.notifications.count'))
                .then(({ data }) => (this.unread = data.count))
                .catch(this.errorHandler);
        },
        notify({ body, title, path }) {
            if (document.hidden && this.desktopNotifications) {
                const notification = new Notification(title, { body });

                notification.onclick = () => {
                    if (path) {
                        this.$router.push({ path })
                            .catch(this.routerErrorHandler);
                    }

                    window.focus();
                };

                window.navigator.vibrate(500);

                return true;
            }

            return false;
        },
        fetch() {
            if (!this.needsUpdate || this.loading) {
                return;
            }

            this.loading = true;

            this.http.get(this.route('core.notifications.index'), {
                params: { offset: this.offset, paginate: this.paginate },
            }).then(({ data }) => {
                this.notifications = this.offset ? this.notifications.concat(data) : data;
                this.offset = this.notifications.length;
                this.needsUpdate = false;
                this.loading = false;
            }).catch(this.errorHandler);
        },
        initDesktopNotification() {
            if (!('Notification' in window) || Notification.permission === 'denied') {
                return;
            }

            if (Notification.permission === 'granted') {
                this.desktopNotifications = true;
                return;
            }

            Notification.requestPermission(permission => {
                if (!('permission' in Notification)) {
                    Notification.permission = permission;
                }
                this.desktopNotifications = permission === 'granted';
            });
        },
        listen() {
            window.Echo.private(this.channels.private).notification(notification => {
                this.unread++;
                this.needsUpdate = true;
                this.offset = 0;

                this.toast(notification);

                return this.notify(notification);
            });
        },
        now() {
            return format(new Date());
        },
        read(notification) {
            this.http.patch(this.route('core.notifications.read', notification.id))
                .then(({ data }) => {
                    this.unread = Math.max(--this.unread, 0);
                    notification.read_at = data.read_at;

                    if (notification.data.path && notification.data.path !== '#') {
                        this.$router.push({ path: notification.data.path })
                            .catch(this.routerErrorHandler);
                    }
                }).catch(this.errorHandler);
        },
        readAll() {
            this.http.post(this.route('core.notifications.readAll'))
                .then(this.updateAll)
                .catch(this.errorHandler);
        },
        updateAll() {
            this.notifications
                .filter(notification => !notification.read_at)
                .forEach(notification => (notification.read_at = this.now()));

            this.unread = 0;
        },
        timeFromNow(date) {
            return formatDistance(date);
        },
        toast({
            level, body, title, icon,
        }) {
            this.toastr.when(title, toastr => toastr.title(title))
                .when(icon, toastr => toastr.icon(icon))
                .when(level, toastr => toastr[level](body), toastr => toastr.info(body));
        },
        visitNotifications() {
            const name = 'core.notifications.index';
            this.$router.push({ name })
                .catch(this.routerErrorHandler);
        },
    },

    render() {
        return this.$slots.default({
            events: {
                scroll: e => this.computeScrollPosition(e),
            },
            fetch: this.fetch,
            loading: this.loading,
            notifications: this.notifications,
            read: this.read,
            readAll: this.readAll,
            timeFromNow: this.timeFromNow,
            unread: this.unread,
            visitNotifications: this.visitNotifications,
        });
    },
};
</script>
