<script>
import { positions } from '@enso-ui/toastr/config';
import { preferences } from '@enso-ui/ui/src/pinia/preferences';

export default {
    name: 'ToastrPosition',

    inject: ['toastr'],

    data: () => ({
        positions,
    }),

    computed: {
        toastrPosition() {
            return preferences().toastrPosition;
        },
    },

    methods: {
        update(position) {
            preferences().setToastrPosition(position);
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
