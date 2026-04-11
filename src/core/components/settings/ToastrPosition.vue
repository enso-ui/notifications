<script>
import { positions } from '@enso-ui/toastr/config';
import { useStore } from '@enso-ui/ui/src/core/services/pinia';

export default {
    name: 'ToastrPosition',

    inject: ['toastr'],

    data: () => ({
        positions,
    }),

    computed: {
        toastrPosition() {
            return useStore('preferences').toastrPosition;
        },
    },

    methods: {
        update(position) {
            useStore('preferences').setToastrPosition(position);
            this.toastr.setup(position);
        },
    },

    render() {
        return this.$slots.default({
            toastrPosition: this.toastrPosition,
            positions: this.positions,
            update: this.update,
        });
    },
};

</script>
