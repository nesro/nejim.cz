<script>
    import { onMount } from 'svelte'
    import ProgressBar from 'progressbar.js'
    
    let circle

    onMount(async () => {
        circle = new ProgressBar.Circle('#container-progress', {
        color: '#FCB03C',
        strokeWidth: 10,
        trailColor: '#f4f4f4',
        duration: 500,
        easing: 'linear',
        from: { color: '#e00' },
        text: {
            value: 'Text',
            className: 'progressbar__label',
            style: {
                // Text color.
                // Default: same as stroke color (options.color)
                color: '#f00',
                fontSize: '16px',
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

/*         circle.animate(0.5);
        circle.setText(progressValue) */
    });

    export function progressAnimate(value, hours, minutes, seconds) {

        minutes = ('0' + minutes).slice(-2)
        seconds = ('0' + seconds).slice(-2)

        circle.animate(value);
        circle.setText('Hotovo: '+ parseFloat(value * 100).toFixed(2) + '%<br>Zbývá: '+hours+':'+minutes+':'+seconds)
    }

</script>

<style>

#container-progress {
    width: 60px;
    height: 60px;
}

</style>
<main>
    <h2>progress</h2>
    <div id="container-progress"></div>
</main>