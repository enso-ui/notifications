<template>
    <div class="level is-mobile">
        <div class="level-left">
            <div class="level-item m-0">
                <span class="menu-item-label">
                    {{ i18n('Notifications') }}
                </span>
            </div>
        </div>
        <div class="level-right">
            <div class="level-item toastr-position settings-control-select">
                <core-toastr-position>
                    <template #default="{ positions, toastrPosition, update }">
                        <dropdown>
                            <template #label>
                                <figure class="image is-16x16">
                                    <img :src="`/images/corners/${toastrPosition}.svg`">
                                </figure>
                            </template>
                            <template #items>
                                <dropdown-item class="p-2"
                                    v-for="position in positions"
                                    :key="position"
                                    :selected="toastrPosition === position"
                                    @select="update(position)">
                                    <figure class="image is-16x16">
                                        <img :src="`/images/corners/${position}.svg`">
                                    </figure>
                                </dropdown-item>
                            </template>
                        </dropdown>
                    </template>
                </core-toastr-position>
            </div>
        </div>
    </div>
</template>

<script>
import { Dropdown, DropdownItem } from '@enso-ui/dropdown/bulma';
import CoreToastrPosition from '../../../core/components/settings/ToastrPosition.vue';

export default {
    name: 'ToastrPosition',

    components: { CoreToastrPosition, Dropdown, DropdownItem },

    inject: ['i18n'],
};
</script>

<style lang="scss">
.toastr-position {
    .dropdown-trigger .button.input {
        position: relative;
    }

    .dropdown-trigger .button.input .dropdown-indicator {
        top: 50%;
        margin-top: -0.6rem;
    }

    .dropdown-menu {
        .dropdown-content {
            min-width: 3.3rem;
            width: 100%;

            .dropdown-item {
                display: flex;
                align-items: center;
                justify-content: center;
            }

            figure {
                margin: 0;
            }
        }
    }
}
</style>
