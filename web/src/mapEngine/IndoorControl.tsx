import { useCallback, useEffect, useMemo, useState } from 'react';
import { useControl } from 'react-map-gl/maplibre';
import type { Map } from 'maplibre-gl';
import debounce from 'debounce';
import arrayEqual from 'array-equal';
import { FilterSpecification } from '@maplibre/maplibre-gl-style-spec';
import { useSharedMapContext } from 'psumaps-shared/src/contexts/SharedMapContext';
import findAllLevels from './levels';
import layers from './layers';

interface IndoorControlProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

const IndoorControl = ({ position = 'bottom-right' }: IndoorControlProps) => {
  const [levels, setLevels] = useState<string[]>([]);
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  const [mapRef, setMapRef] = useState<Map | null>(null);
  const { indoorLevel: currentLevel, setIndoorLevel } = useSharedMapContext();

  const updateFilters = useCallback((map: Map, level: string) => {
    if (map.isStyleLoaded())
      layers
        .filter((layer) => !layer.id.includes('indoorb'))
        .forEach((layer) => {
          if (layer.type !== 'background') {
            map.setFilter(layer.id, [
              ...layer.filter,
              ['==', 'level', level],
            ] as FilterSpecification);
          }
        });
  }, []);

  const handleLevelChange = useCallback(
    (map: Map, level: string) => {
      setIndoorLevel(level);
      updateFilters(map, level);
    },
    [setIndoorLevel, updateFilters, mapRef?.isStyleLoaded()],
  );

  const updateLevels = useCallback(
    (map: Map) => {
      if (!map.isStyleLoaded() || !map.getSource('indoorequal')) return;

      const features = map.querySourceFeatures('indoorequal', {
        sourceLayer: 'area',
        filter: ['all', ['==', 'class', 'room']],
      });
      const newLevels = findAllLevels(features);
      if (!arrayEqual(newLevels, levels)) {
        setLevels(newLevels);
        if (!newLevels.includes(currentLevel)) {
          handleLevelChange(map, '1');
        }
      }
    },
    [currentLevel, handleLevelChange, levels],
  );

  const debouncedUpdateLevels = useMemo(
    () => debounce((map: Map) => updateLevels(map), 300),
    [updateLevels],
  );

  const updateButtons = useCallback(() => {
    if (!containerRef || !mapRef) return;

    containerRef.innerHTML = '';
    levels.forEach((level) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = level;
      button.title = `Level ${level}`;
      button.setAttribute('aria-label', `Switch to level ${level}`);
      button.className = 'indoor-control-btn';
      if (level === currentLevel) {
        button.classList.add('active');
      }
      button.addEventListener('click', () => handleLevelChange(mapRef, level));
      containerRef.appendChild(button);
    });
  }, [containerRef, mapRef, levels, currentLevel, handleLevelChange]);

  useEffect(() => {
    updateButtons();
  }, [levels, currentLevel, updateButtons]);

  useEffect(() => {
    if (mapRef) handleLevelChange(mapRef, currentLevel);
  }, [currentLevel, handleLevelChange, mapRef]);

  const handleStyleLoad = (map: Map) => {
    updateFilters(map, currentLevel);
    updateLevels(map);
  };

  useControl(
    () => ({
      onAdd(map: Map) {
        const container = document.createElement('div');
        container.className =
          'maplibregl-ctrl maplibregl-ctrl-group indoor-control';
        setContainerRef(container);
        setMapRef(map);

        if (map.isStyleLoaded()) {
          handleStyleLoad(map);
        }

        map.on('load', () => handleStyleLoad(map));
        map.on('data', () => debouncedUpdateLevels(map));
        map.on('move', () => debouncedUpdateLevels(map));

        return container;
      },
      onRemove(map: Map) {
        debouncedUpdateLevels.clear();
        map.off('load', () => handleStyleLoad(map));
        map.off('data', () => debouncedUpdateLevels(map));
        map.off('move', () => debouncedUpdateLevels(map));
        setContainerRef(null);
        setMapRef(null);
      },
    }),
    { position },
  );

  return null;
};

export default IndoorControl;
