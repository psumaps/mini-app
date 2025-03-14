import { useCallback, useEffect, useState } from 'react';
import { useControl } from 'react-map-gl/maplibre';
import type { Map } from 'maplibre-gl';
import debounce from 'debounce';
import arrayEqual from 'array-equal';
import { FilterSpecification } from '@maplibre/maplibre-gl-style-spec';
import findAllLevels from './levels';
import layers from './layers';

interface IndoorControlProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  onLevelChange?: (level: string) => void;
  indoorLevel?: string;
}

const IndoorControl = ({
  position = 'bottom-right',
  onLevelChange,
                         indoorLevel,
}: IndoorControlProps) => {
  const [levels, setLevels] = useState<string[]>([]);
  const [currentLevel, setCurrentLevel] = useState('1');
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  const [mapRef, setMapRef] = useState<Map | null>(null);

  const updateFilters = useCallback((map: Map, level: string) => {
    layers
      .filter((layer) => !layer.id.includes('indoorb'))
      .forEach((layer) => {
        if (layer.type !== 'background') {
          map.setFilter(layer.id, [
            // @ts-expect-error idk
            ...layer.filter,
            ['==', 'level', level],
          ] as FilterSpecification);
        }
      });
  }, []);

  const handleLevelChange = useCallback(
    (map: Map, level: string) => {
      setCurrentLevel(level);
      updateFilters(map, level);
      onLevelChange?.(level);
    },
    [onLevelChange, updateFilters],
  );

  useEffect(() => {
    if (indoorLevel && mapRef) handleLevelChange(mapRef, indoorLevel);
  }, [handleLevelChange, indoorLevel, mapRef]);

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

  const updateLevels = useCallback(
    (map: Map) => {
      if (map.getSource('indoorequal')) {
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
      }
    },
    [currentLevel, handleLevelChange, levels],
  );

  useEffect(() => {
    updateButtons();
  }, [levels, currentLevel, updateButtons]);

  useControl(
    () => {
      let debouncedUpdateLevels: debounce.DebouncedFunction<() => void>;
      let debouncedLoad: () => void;

      return {
        onAdd(map: Map) {
          const container = document.createElement('div');
          container.className =
            'maplibregl-ctrl maplibregl-ctrl-group indoor-control';
          setContainerRef(container);
          setMapRef(map);

          debouncedLoad = () => {
            updateFilters(map, currentLevel);
            updateLevels(map);
          };

          debouncedUpdateLevels = debounce(() => updateLevels(map), 300);

          map.on('load', debouncedLoad);
          map.on('data', debouncedUpdateLevels);
          map.on('move', debouncedUpdateLevels);

          return container;
        },
        onRemove(map: Map) {
          if (debouncedUpdateLevels) {
            debouncedUpdateLevels.clear();
            map.off('load', debouncedLoad);
            map.off('data', debouncedUpdateLevels);
            map.off('move', debouncedUpdateLevels);
          }
          setContainerRef(null);
          setMapRef(null);
        },
      };
    },
    { position },
  );

  return null;
};

export default IndoorControl;
