import L from 'leaflet'
import * as R from 'ramda'
import { arc } from '../features/geo-helper'
import { shape } from '../features/shape'
import '../features/Arc'

L.Feature['G*T*Q-----'] = L.TACGRP.Arc.extend({

  _shape (group, options) {
    options.styles.clipping = 'mask'

    return shape(group, options, {
      points: ({ C, radius, radians }) => {
        const steps = 32
        const delta = radians.delta / steps
        const xs = R.range(0, steps + 1).map(x => radians.start + x * delta)

        const outer = arc(C, radius * 1.2)(xs)
        const inner = arc(C, radius)(xs)

        const spikes = []
        for (let i = 1; i < inner.length - 1; i++) {
          spikes.push([inner[i], outer[i]])
        }

        return [
          inner, ...spikes
        ]
      }
    })
  },

  _labels () {
    const alpha = radians => radians.start + radians.delta / 2
    return [{
      placement: ({ C, radius, radians }) => arc(C, radius)([alpha(radians)])[0],
      lines: ['R'],
      'font-size': 18,
      angle: ({ radians }) => alpha(radians) / Math.PI * 180
    }]
  }
})
