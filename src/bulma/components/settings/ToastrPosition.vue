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
                                <dropdown-item v-for="position in positions"
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
    .dropdown-trigger .button.input .image {
        margin: 0;
    }

    .dropdown-trigger .button.input .image img,
    .dropdown-content .dropdown-item .image img {
        display: block;
        width: 0.95rem;
        height: 0.95rem;
        margin: auto;
        object-fit: contain;
    }

    .dropdown .dropdown-content {
        width: 4.6em;

        .items figure {
            margin: auto;
        }
    }
}
</style>
