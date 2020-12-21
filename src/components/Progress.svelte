<script>
    import { onMount } from 'svelte'
    import ProgressBar from 'progressbar.js'
    
    let circle

    onMount(async () => {
        circle = new ProgressBar.Circle('#container-progress', {
        color: '#FCB03C',
        strokeWidth: 10,
        trailColor: '#f4f4f4',
        duration: 2000,
        easing: 'linear',
        from: { color: '#e00' },
        text: {
            value: 'Text',
            className: 'progressbar__label',
            style: {
                // Text color.
                // Default: same as stroke color (options.color)
                color: '#f00',
                fontSize: '28px',
                position: 'absolute',
                left: '50%',
                top: '50%',
                padding: 0,
                margin: 0,
                // You can specify styles which will be browser prefixed
                transform: {
                    prefix: true,
                    value: 'translate(-50%, -50%)'
                }
            }
        },
        to: { color: '#0e0' },
        step: function(state, circle, attachment) {
            circle.path.setAttribute('stroke', state.color);
        },
        })
        circle.animate(0.9);
        circle.setText(Date.now())
    });



</script>

<style>

#container-progress {
    width: 30px;
    height: 30px;
}

#container-progress > svg {
    width: 100%;
    display: block;
}

</style>
<main>
    <h2>progress</h2>
    <div id="container-progress"></div>
</main>