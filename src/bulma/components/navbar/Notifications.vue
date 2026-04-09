<template>
    <core-notifications>
        <template #default="{
                events, fetch, loading, notifications, read,
                readAll, timeFromNow, unread, visitNotifications
            }">
            <navbar-item :icon="faBell"
                :loading="loading"
                @show="fetch"
                @touch="visitNotifications"
                ref="navbarItem">
                <template #sup
                    v-if="unread > 0">
                    <span class="has-text-danger">
                        {{ unread }}
                    </span>
                </template>
                <template #default>
                    <div class="notifications-dropdown">
                        <div class="notification-list"
                            v-on="events">
                            <a v-for="notification in notifications"
                                :key="notification.id"
                                class="navbar-item"
                                @click="read(notification)">
                                <p class="is-notification"
                                    :class="{
                                        'has-text-grey-light': notification.read_at,
                                        'is-bold': !notification.read_at,
                                    }">
                                    <fa v-if="notification.data.icon"
                                        :icon="notification.data.icon"/>
                                    {{ notification.data.body }}
                                </p>
                                <p>
                                    <small :class="{
                                        'has-text-grey-light': notification.read_at,
                                        'has-text-info': !notification.read_at,
                                    }">
                                        {{ timeFromNow(notification.created_at) }}
                                    </small>
                                </p>
                            </a>
                        </div>
                        <hr v-if="notifications.length > 0"
                            class="navbar-divider">
                        <nav v-if="notifications.length > 0"
                            class="level navbar-item">
                            <div class="level-left">
                                <div class="level-item">
                                    <a class="button is-small is-info ml-1"
                                        @click="visitNotifications();$refs.navbarItem.hide()">
                                        <span>{{ i18n('See all') }}</span>
                                        <span class="icon is-small">
                                            <fa :icon="faEye"/>
                                        </span>
                                    </a>
                                </div>
                            </div>
                            <div class="level-right">
                                <div class="level-item">
                                    <a class="button is-small is-success"
                                        @click="readAll">
                                        <span>{{ i18n('Mark all as read') }}</span>
                                        <span class="icon is-small">
                                            <fa :icon="faCheck"/>
                                        </span>
                                    </a>
                                </div>
                            </div>
                        </nav>
                        <a v-else
                            class="navbar-item">
                            <span v-if="unread || loading">
                                {{ i18n('Loading...') }}
                            </span>
                            <span v-else-if="!unread">
                                {{ i18n("You don't have any notifications") }}
                            </span>
                        </a>
                    </div>
                </template>
            </navbar-item>
        </template>
    </core-notifications>
</template>

<script>
import { clickOutside } from '@enso-ui/directives';
import { FontAwesomeIcon as Fa } from '@fortawesome/vue-fontawesome';
import { faBell, faCheck, faEye } from '@fortawesome/free-solid-svg-icons';
import NavbarItem from '@enso-ui/ui/src/bulma/components/navbar/NavbarItem.vue';
import CoreNotifications from '../../../core/components/navbar/Notifications.vue';

export default {
    name: 'Notifications',

    directives: { clickOutside },

    components: { CoreNotifications, Fa, NavbarItem },

    inject: ['i18n'],

    data: () => ({
        faBell,
        faCheck,
        faEye,
    }),
};

</script>

<style lang="scss">
.navbar-item {
    --notifications-surface: var(--bulma-scheme-main-bis);

    .notifications-dropdown {
        background-color: var(--notifications-surface) !important;
        color: var(--bulma-text);
    }

    .notification-list {
        width: 300px;
        overflow-x: hidden;
        max-height: 400px;
        overflow-y: auto;
        background-color: var(--notifications-surface) !important;
    }

    .notifications-dropdown > .navbar-item,
    .notifications-dropdown > .level.navbar-item,
    .notification-list > .navbar-item {
        background-color: transparent !important;
    }

    .notifications-dropdown > .navbar-item,
    .notifications-dropdown > .level.navbar-item {
        background-color: var(--notifications-surface) !important;
        margin: 0;
    }

    .notifications-dropdown > .level.navbar-item {
        padding: 1rem;
    }

    .notifications-dropdown > .level.navbar-item .level-item {
        margin-bottom: 0;
    }

    .notification-list > .navbar-item:hover,
    .notification-list > .navbar-item:focus,
    .notification-list > .navbar-item.is-active {
        background-color: var(--bulma-scheme-main-ter);
    }

    .notifications-dropdown > .navbar-divider {
        background-color: var(--bulma-border);
        margin: 0;
    }

    .is-notification {
        white-space: normal;
        width: 268px;
        overflow-x: hidden;
    }
}
</style>
