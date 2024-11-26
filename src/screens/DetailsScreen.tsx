import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import axios from 'axios';
import {Project} from '../types';

const API_URL = 'http://192.168.1.36:8000/api/proyectos/';

const DetailsScreen = ({route}: any) => {
  const {codigo_unico_inversion} = route.params;
  const [projectDetails, setProjectDetails] = useState<Project[]>([]);

  useEffect(() => {
    axios
      .get(`${API_URL}${codigo_unico_inversion}`)
      .then(response => {
        setProjectDetails(response.data);
      })
      .catch(error => {
        console.error('Error fetching details:', error);
      });
  }, [codigo_unico_inversion]);

  const capitalizeFirstLetter = (text: string) => {
    return text
      ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
      : '';
  };

  const isValidValue = (value: string | number | null | undefined) => {
    if (
      !value ||
      value === 'Desconocido' ||
      value === '' ||
      value === '0' ||
      value.toString() === 'nan'
    ) {
      return false;
    }
    return true;
  };

  const renderField = (title: string, value: string | number) => {
    if (isValidValue(value)) {
      return (
        <Text style={styles.textCardDetails}>
          {title}: {capitalizeFirstLetter(value.toString().toLowerCase())}
        </Text>
      );
    }
    return null;
  };

  // Función para formatear la fecha (202405 -> 2024-05)
  const formatDate = (dateString: string) => {
    if (dateString && dateString.length === 6) {
      return `${dateString.slice(0, 4)}-${dateString.slice(4, 6)}`;
    }
    return ''; // Retorna vacío si el valor es incorrecto o nulo
  };

  const replaceWithTilde = (text: string) => {
    const replacements: {[key: string]: string} = {
      FERREAFE: 'FERREÑAFE',
      CAARIS: 'CAÑARIS',
      // Añadir más reemplazos si es necesario
    };

    return text.replace(
      /\b(FERREAFE|CAARIS)\b/g,
      match => replacements[match] || match,
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={projectDetails}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View style={styles.cardDetail}>
            <View>
              <Text style={styles.cardTitleDetails}>
                DESCRIPCIÓN ALTERNATIVA
              </Text>
              {renderField('', item.descripcion_alternativa)}
            </View>
            <View>
              <Text style={styles.cardTitleDetails}>
                RESPONSABLES DE LA INVERSIÓN
              </Text>
              <View style={styles.textCardDetails}>
                {renderField('Unidad OPMI', item.unidad_opmi)}
                {renderField('Unidad UEI', item.unidad_uei)}
                {renderField('Unidad UF', item.unidad_uf)}
                {renderField('Responsable OPMI', item.responsable_opmi)}
                {renderField('Responsable UEI', item.responsable_uei)}
                {renderField('Responsable UF', item.responsable_uf)}
              </View>
            </View>

            <View>
              <Text style={styles.cardTitleDetails}>
                ENTIDADES RELACIONADAS CON LA INVERSIÓN
              </Text>
              {renderField('Entidad', item.entidad)}
              {renderField('Ejecutora', item.ejecutora)}
              {renderField('Entidad OPI', item.entidad_opi)}
              {renderField('Responsable OPI', item.responsable_opi)}
              {renderField('Departamento', replaceWithTilde(item.departamento))}
              {renderField('Provincia', replaceWithTilde(item.provincia))}
              {renderField(
                'Centro poblado',
                replaceWithTilde(item.centro_poblado),
              )}
              {renderField('Último estudio', item.ultimo_estudio)}
            </View>
            <View>
              <Text style={styles.cardTitleDetails}>
                FINANZAS RELACIONADO A LA INVERSIÓN
              </Text>
              <View style={styles.textCardDetails}>
                {renderField('Monto F16', item.monto_f16)}
                {renderField('Costo actualizado', item.costo_actualizado)}
                {renderField(
                  'Devengado acumulado año anterior',
                  item.devengado_acumulado_ano_anterior,
                )}
                {renderField(
                  'Mes-año primer devengado',
                  formatDate(item.mes_ano_primer_devengado),
                )}
                {renderField(
                  'Mes-año último devengado',
                  formatDate(item.mes_ano_ultimo_devengado),
                )}
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  cardDetail: {
    borderWidth: 0.5,
    backgroundColor: '#fff',
    marginTop: 15,
    padding: 14,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitleDetails: {
    paddingTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  textCardDetails: {
    fontSize: 14,
    color: 'black',
    paddingBottom: 1,
  },
});

export default DetailsScreen;
