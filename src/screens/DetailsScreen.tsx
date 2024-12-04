import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import axios from 'axios';
import {Project} from '../types';

const API_URL = 'http://192.168.1.36:8000/api/proyectos/';

const DetailsScreen = ({route, navigation}: any) => {
  const {codigo_unico_inversion} = route.params;
  const [projectDetails, setProjectDetails] = useState<Project[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedProjects, setExpandedProjects] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    fetchProjectDetails();
  }, [codigo_unico_inversion]);

  const fetchProjectDetails = () => {
    setRefreshing(true);
    axios
      .get(`${API_URL}${codigo_unico_inversion}`)
      .then(response => {
        setProjectDetails(response.data);
        setRefreshing(false);
      })
      .catch(error => {
        setRefreshing(false);
        console.error('Error fetching details:', error);
      });
  };

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
      value.toString() === 'nan' ||
      value === '0.00'
    ) {
      return false;
    }
    return true;
  };

  const renderField = (title: string, value: string | number) => {
    if (isValidValue(value)) {
      return (
        <Text style={styles.textCardDetails}>
          {title}: {capitalizeFirstLetter(value.toString())}
        </Text>
      );
    }
    return null;
  };

  const cleanText = (text: string) => {
    return text.replace(/^:\s*/, '').trim();
  };

  const replaceWithTilde = (text: string) => {
    const replacements: {[key: string]: string} = {
      FERREAFE: 'FERREÑAFE',
      CAARIS: 'CAÑARIS',
    };
    return replacements[text] || text;
  };

  // Función para formatear la fecha (202405 -> 2024-05)
  const formatDate = (dateString: string) => {
    if (dateString && dateString.length === 6) {
      return `${dateString.slice(0, 4)}-${dateString.slice(4, 6)}`;
    }
    return '';
  };

  const handleToggleDetails = (id: string) => {
    setExpandedProjects(prevState => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const formatSoles = (amount: any) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={projectDetails}
        keyExtractor={(item: Project) => item.id.toString()}
        renderItem={({item}: {item: Project}) => (
          <View style={styles.cardDetail}>
            <View>
              <Text style={styles.cardTitleDetails}>
                DESCRIPCIÓN ALTERNATIVA
              </Text>
              {renderField('', cleanText(item.descripcion_alternativa))}
            </View>
            {expandedProjects[item.id] && (
              <>
                <View>
                  <Text style={styles.cardTitleDetails}>
                    RESPONSABLES DE LA INVERSIÓN
                  </Text>
                  {renderField('Unidad OPMI', item.unidad_opmi)}
                  {renderField('Unidad UEI', item.unidad_uei)}
                  {renderField('Unidad UF', item.unidad_uf)}
                  {renderField('Responsable OPMI', item.responsable_opmi)}
                  {renderField('Responsable UEI', item.responsable_uei)}
                  {renderField('Responsable UF', item.responsable_uf)}
                </View>
                <View>
                  <Text style={styles.cardTitleDetails}>
                    ENTIDADES RELACIONADAS CON LA INVERSIÓN
                  </Text>
                  {renderField('Entidad', item.entidad)}
                  {renderField('Ejecutora', item.ejecutora)}
                  {renderField('Entidad OPI', item.entidad_opi)}
                  {renderField('Responsable OPI', item.responsable_opi)}
                  {renderField(
                    'Departamento',
                    replaceWithTilde(item.departamento),
                  )}
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
                    {renderField('Monto F16', formatSoles(item.monto_f16))}
                    {renderField('Costo actualizado', formatSoles(item.costo_actualizado))}
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
              </>
            )}
            <TouchableOpacity
              style={styles.buttonView}
              onPress={() => handleToggleDetails(item.id.toString())}>
              <Text style={styles.buttonTextInnerView}>
                {expandedProjects[item.id] ? 'Ver menos' : 'Ver más'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay detalles disponibles.</Text>
        }
        onRefresh={fetchProjectDetails}
        refreshing={refreshing}
        initialNumToRender={10}
        removeClippedSubviews={true}
      />
      <TouchableOpacity
        style={styles.buttonView}
        onPress={() =>
          navigation.navigate('Graphic', {codigo_unico_inversion})
        }>
        <Text style={styles.buttonTextInnerView}>Gráfico</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
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
  graphContainer: {
    //width: '100%',

    marginTop: 20,
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
  },
  graphTitle: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  barContainer: {
    //borderWidth: 1,
    flexDirection: 'row', // Este mantiene los elementos en fila (horizontal)
    alignItems: 'flex-end', // Alineación al fondo, para que las barras se alineen de acuerdo a su altura
    marginVertical: 5,
  },
  containerObject: {
    flexDirection: 'column',
    borderWidth: 3,
    width: '100%',
    //height: 100,
  },
  textStyleGrafico: {
    color: 'black',
    textAlign: 'center',
  },
  bar: {
    marginTop: 4,
    marginBottom: 4,
    alignSelf: 'center',
    borderWidth: 1,
    width: 100,
    height: '1%',
    backgroundColor: '#4CAF50',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
  buttonView: {
    alignSelf: 'center',
    width: 120,
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonTextInnerView: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DetailsScreen;
